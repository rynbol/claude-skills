export type CacheTimer = { anchorMs: number; ttlS: number; tokens: number }

/** One timer per view: '' is the main conversation, any other key a helper's agent id. */
export type CacheTimers = Record<string, CacheTimer>

declare module 'claude-code' {
  interface PluginState {
    'cache-timer': {
      timers: Shaped<CacheTimers>
      now: number
      frame: number
    }
  }
}
