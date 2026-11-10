import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'prompt-master',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10,
    bodyColumns: 80, scroll: { offset: 0, bodyRows: 10 }, view: {},
  },
} as const

test('the button rewrites the draft in the prompt box, and Undo puts it back', async ($, on) => {
  let box = 'fix login bug pls'
  on('prompt.read', () => ({ value: { text: box, cursor: box.length } }))
  on('prompt.fill', (_, e) => {
    box = e.text
    return { isFilled: true, text: box, cursor: box.length }
  })
  on('model.complete', () => ({ value: { isAnswered: true, text: 'Find and fix the login bug.', usage: { input_tokens: 1, output_tokens: 1, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 } } }))
  on('ui.toast', () => ({ value: undefined }))

  for (const surface of ['terminal', 'desktop'] as const) {
    box = 'fix login bug pls'
    const ui = await $.ui.mount({ ...BAND, surface })
    await ui.press({ key: 'prompt-master' })
    expect(box).toBe('Find and fix the login bug.')
    await ui.press({ key: 'prompt-master-undo' })
    expect(box).toBe('fix login bug pls')
    await ui.unmount()
  }
})
