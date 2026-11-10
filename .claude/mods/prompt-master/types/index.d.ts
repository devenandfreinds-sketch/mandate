export type PromptMasterStatus = 'idle' | 'working'

declare module 'claude-code' {
  interface PluginState {
    'prompt-master': { status: PromptMasterStatus; original: string | null }
  }
}
