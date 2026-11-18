import { expect, mock, test } from 'claude-code/testing'

const T0 = Date.UTC(2026, 10, 18, 20, 0, 0)

const BAND = {
  plugin: 'cache-timer',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 4,
    bodyColumns: 120,
    scroll: { offset: 0, bodyRows: 4 },
    view: {},
  },
} as const

const TIMERS = {
  '': { anchorMs: T0, ttlS: 3600, tokens: 279323 },
  a1: { anchorMs: T0, ttlS: 300, tokens: 31200 },
}

function stateGet(now: number) {
  return (_: unknown, e: { key: string }) => {
    if (e.key === 'timers') return { value: { value: { shape: 'timers-1', value: TIMERS }, version: 1 } }
    return { value: { value: now, version: 1 } }
  }
}

function helperView(id: string) {
  return { ...BAND, props: { ...BAND.props, view: { agentId: id } } }
}

for (const surface of ['terminal', 'desktop'] as const) {
  test(`a warm cache shows the time left (${surface})`, async ($, on) => {
    on('state.get', stateGet(T0 + (18 * 60 + 48) * 1000))
    const ui = await $.ui.mount({ ...BAND, surface })

    const row = await ui.find({ type: 'Text', text: /cache/ })
    expect(row?.text).toMatch(/^\(•ᴗ•\) cache awake · 41m left · until \d{1,2}:\d{2} (AM|PM)$/)
    await ui.unmount()
  })

  test(`an expired cache says so and names the tokens (${surface})`, async ($, on) => {
    on('state.get', stateGet(T0 + 3601 * 1000))
    const ui = await $.ui.mount({ ...BAND, surface })

    const row = await ui.find({ type: 'Text', text: /cache/ })
    expect(row?.text).toMatch(/^\(－_－\) zZ{0,2} +cache asleep · next message wakes it \(279k tokens\)$/)
    await ui.unmount()
  })
}

test('while the agent works, the row says the cache is in use', async ($, on) => {
  on('state.get', stateGet(T0 + 60_000))
  const ui = await $.ui.mount({ ...BAND, props: { ...BAND.props, isWorking: true }, surface: 'terminal' })

  expect((await ui.find({ type: 'Text', text: /cache/ }))?.text).toBe('(•ᴗ•)♪ cache awake · in use')
  await ui.unmount()
})

test('a helper in view shows its own 5-minute timer', async ($, on) => {
  on('state.get', stateGet(T0 + 90_000))
  on('agent.list', () => ({ value: [] }))
  const ui = await $.ui.mount({ ...helperView('a1'), surface: 'terminal' })

  const row = await ui.find({ type: 'Text', text: /cache/ })
  expect(row?.text).toMatch(/^\(•_•;\) helper cache getting sleepy · 3m left · reply to keep it up$/)
  await ui.unmount()
})

test('a running helper in view says its cache is in use', async ($, on) => {
  on('state.get', stateGet(T0 + 90_000))
  on('agent.list', () => ({ value: [{ id: 'a1', status: 'running', description: 'x', type: 'claude' }] as never }))
  const ui = await $.ui.mount({ ...helperView('a1'), surface: 'terminal' })

  expect((await ui.find({ type: 'Text', text: /cache/ }))?.text).toBe('(•ᴗ•)♪ helper cache awake · in use')
  await ui.unmount()
})

test('a helper with no reading yet leaves the band to the engine', async ($, on) => {
  on('state.get', stateGet(T0 + 90_000))
  on('agent.list', () => ({ value: [] }))
  on('ui.render', ($, e) => {
    const { Text } = $.ui.resolve(e)

    return <Text>engine</Text>
  })
  const ui = await $.ui.mount({ ...helperView('zz'), surface: 'terminal' })

  expect((await ui.find({ type: 'Text', text: /engine/ }))?.text).toBe('engine')
  await ui.unmount()
})

test('with no timer for the view, the row reads the log by itself', async ($, on) => {
  const clock = mock.clock(on, { now: T0 })
  const calls: string[][] = []
  on('session.id', () => ({ value: 's1' }))
  on('process.run', (_, e) => {
    calls.push([...e.argv])
    return { value: { exitCode: 0, stdout: '{}', stderr: '', isStdoutTruncated: false, isStderrTruncated: false } }
  })
  const ui = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await clock.advance(10)

  expect(calls.length).toBe(1)
  expect(calls[0]?.[0]).toMatch(/\/scripts\/cache-timer\.py$/)
  expect(calls[0]?.slice(1)).toEqual(['--session', 's1'])
  await ui.unmount()
})
