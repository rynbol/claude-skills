import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, Timer } from 'claude-code'

import type { CacheTimer, CacheTimers } from '../types'

const WARN_S = 600
const MAIN = ''
const FRAME_MS = 2000

const timers = atom({ plugin: 'cache-timer', key: 'timers' } as const, {} as CacheTimers, { shape: 'timers-1' })
const now = atom({ plugin: 'cache-timer', key: 'now' } as const, 0)
const frame = atom({ plugin: 'cache-timer', key: 'frame' } as const, 0)

const PET = {
  awake: ['(•ᴗ•)', '(•ᴗ•)', '(•ᴗ•)', '(-ᴗ-)'],
  sleepy: ['(•_•;)', '(-_-;)', '(•_•;)'],
  asleep: ['(－_－) z  ', '(－_－) zZ ', '(－_－) zZz'],
}
const pet = (frames: readonly string[], k: number) => frames[k % frames.length] ?? frames[0]

let pending: Timer | undefined
// Views whose log this load has read: a reload starts with no timers and may get no session.start.
const asked = new Set<string>()

function nextChangeMs(t: CacheTimer, ms: number) {
  const leftMs = t.anchorMs + t.ttlS * 1000 - ms
  if (leftMs <= 0) return Infinity
  return leftMs > 60_000 ? leftMs % 60_000 || 60_000 : leftMs
}

// Redraw only when some shown text changes: at each whole minute left, then at expiry.
async function tick($: EngineInterface) {
  pending?.cancel()
  pending = undefined
  const ms = await $.clock.now()
  await update($, now, () => ms)
  const wait = Math.min(...Object.values(await read($, timers)).map(t => nextChangeMs(t, ms)))
  if (wait !== Infinity) pending = $.clock.after(wait + 50, () => void tick($))
}

async function rescan($: EngineInterface, view: string) {
  asked.add(view)
  const session = await $.session.id()
  const script = `${$.plugin.root}/scripts/cache-timer.py`
  const argv = view === MAIN ? [script, '--session', session] : [script, '--session', session, '--agent', view]
  const { exitCode, stdout } = await $.process.run(argv, { timeoutMs: 5000 })
  if (exitCode !== 0) return
  const t = JSON.parse(stdout) as { anchor_ms?: number; ttl_s?: number; tokens?: number }
  await update($, timers, all => {
    const { [view]: _old, ...rest } = all
    return t.anchor_ms === undefined
      ? rest
      : { ...rest, [view]: { anchorMs: t.anchor_ms, ttlS: t.ttl_s ?? 300, tokens: t.tokens ?? 0 } }
  })
  await tick($)
}

function clock(ms: number) {
  const d = new Date(ms)
  const h = d.getHours() % 12 || 12
  return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${d.getHours() < 12 ? 'AM' : 'PM'}`
}

function tokens(n: number) {
  return n >= 1000 ? `${Math.round(n / 1000)}k` : String(n)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const started = await next(e)
    void rescan($, MAIN)
    $.clock.every(FRAME_MS, () => void update($, frame, k => (k + 1) % 12))

    return started
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    void rescan($, e.agentId ?? MAIN)

    return done
  })

  on('session.end', async ($, e, next) => {
    if (e.reason === 'clear') {
      pending?.cancel()
      await update($, timers, () => ({}))
    }

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) {
      return next(e)
    }

    const view = e.props.view.agentId ?? MAIN
    const label = view === MAIN ? 'cache' : 'helper cache'
    const isWorking =
      view === MAIN ? e.props.isWorking : (await $.agent.list()).some(a => a.id === view && a.status === 'running')
    const { Text } = $.ui.resolve(e)
    if (isWorking) {
      return <Text color="green">(•ᴗ•)♪ {label} awake · in use</Text>
    }

    const t = (await read($, timers))[view]
    const ms = await read($, now)
    if (t === undefined || ms === 0) {
      if (!asked.has(view)) {
        asked.add(view)
        $.clock.after(0, () => void rescan($, view))
      }
      return next(e)
    }

    // Read the frame only for a row on screen, so a collapsed band or a busy agent costs no redraws.
    const k = e.props.isCollapsed ? 0 : await read($, frame)
    const endsAt = t.anchorMs + t.ttlS * 1000
    const leftS = (endsAt - ms) / 1000
    if (leftS <= 0) {
      return (
        <Text color="red">
          {pet(PET.asleep, k)} {label} asleep · next message wakes it ({tokens(t.tokens)} tokens)
        </Text>
      )
    }

    const left = leftS < 60 ? '<1m' : `${Math.floor(leftS / 60)}m`
    if (leftS < WARN_S) {
      return (
        <Text color="yellow">
          {pet(PET.sleepy, k)} {label} getting sleepy · {left} left · reply to keep it up
        </Text>
      )
    }

    return (
      <Text color="green">
        {pet(PET.awake, k)} {label} awake · {left} left · until {clock(endsAt)}
      </Text>
    )
  })
}
