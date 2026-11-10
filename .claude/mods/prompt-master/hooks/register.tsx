import { atom, read, update } from 'claude-code'
import type { EngineInterface as Engine, Register } from 'claude-code'

import type { PromptMasterStatus } from '../types'

const status = atom({ plugin: 'prompt-master', key: 'status' } as const, 'idle' as PromptMasterStatus)
// The draft as it was before the last rewrite, so Undo can put it back.
const original = atom({ plugin: 'prompt-master', key: 'original' } as const, null as string | null)

const SYSTEM = `You are Prompt Master, an expert prompt engineer. The user gives you a rough prompt they are about to send to Claude (often a coding agent working in their repository). Rewrite it into a better prompt.

Rules:
- Keep the user's intent, scope and every concrete detail (names, paths, numbers, errors, code). Never invent requirements, facts or files.
- State the goal first and plainly, then any context, constraints and what "done" looks like.
- Fix spelling and grammar; make vague asks specific only where the rough prompt implies it.
- Use short bullet points or numbered steps only when the task has several parts; keep simple asks to one or two sentences.
- Write in the first person as the user, addressed to Claude. Keep it concise: no filler, no preamble.
- Output ONLY the rewritten prompt text. No quotes, no headings like "Rewritten prompt:", no commentary.`

async function rewrite($: Engine, text: string) {
  const r = await $.model.complete({
    model: 'sonnet',
    system: SYSTEM,
    prompt: `<rough_prompt>\n${text}\n</rough_prompt>`,
    maxTokens: 2048,
    timeoutMs: 60000,
  })
  if (!r.isAnswered) return { ok: false as const, reason: r.reason }
  const out = r.text.trim()
  return out ? { ok: true as const, text: out } : { ok: false as const, reason: 'empty-reply' }
}

async function runOnDraft($: Engine) {
  if ((await read($, status)) === 'working') return
  const box = await $.prompt.read()
  const draft = box.text.trim()
  if (!draft) {
    $.ui.toast('Prompt Master: type a rough prompt first')
    return
  }
  await update($, status, () => 'working' as PromptMasterStatus)
  try {
    const r = await rewrite($, draft)
    if (!r.ok) {
      $.ui.toast(`Prompt Master couldn't rewrite it (${r.reason})`)
      return
    }
    const filled = await $.prompt.fill({ text: r.text, mode: 'replace' })
    if (filled.isFilled) {
      await update($, original, () => box.text)
      $.ui.toast('Prompt rewritten. Review it, then press Enter to send')
    }
  } finally {
    await update($, status, () => 'idle' as PromptMasterStatus)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'prompt-master',
      description: 'Rewrite a rough prompt into a better one: /prompt-master <rough prompt>',
    })
    return next(e)
  })

  // /prompt-master <rough prompt>: works on every surface, including mobile.
  // Rewrites the text after the command and puts the result in the prompt box.
  on('command.run', { command: 'prompt-master' }, async ($, e) => {
    const rough = e.args.trim()
    if (!rough) {
      return {
        text: 'Usage: /prompt-master <your rough prompt>. The rewrite lands in the prompt box for you to review and send. Or type in the box and press the Prompt Master button above it.',
        isTextDisplayOnly: true,
      }
    }
    const r = await rewrite($, rough)
    if (!r.ok) return { text: `Prompt Master couldn't rewrite it (${r.reason}).`, isTextDisplayOnly: true }
    const filled = await $.prompt.fill({ text: r.text, mode: 'replace' })
    if (filled.isFilled) await update($, original, () => rough)
    return {
      text: filled.isFilled
        ? 'Rewritten prompt is in the box. Review it, then press Enter to send.'
        : `Rewritten prompt:\n\n${r.text}`,
      isTextDisplayOnly: true,
    }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const isWorking = (await read($, status)) === 'working'
    const prev = await read($, original)

    return (
      <Box flexDirection="row" gap={1}>
        <Button key="prompt-master" label={isWorking ? 'Prompt Master: rewriting...' : '✨ Prompt Master'} hotkey="p" onPress={() => runOnDraft($)} />
        {prev !== null && !isWorking && (
          <Button key="prompt-master-undo" label="Undo" hotkey="u" onPress={async () => {
            const back = await read($, original)
            if (back === null) return
            await $.prompt.fill({ text: back, mode: 'replace' })
            await update($, original, () => null)
          }} />
        )}
        {isWorking && <Text dimColor>polishing your prompt</Text>}
      </Box>
    )
  })

  // A sent prompt ends the rewrite; drop the Undo.
  on('prompt.submit', async ($, e, next) => {
    await update($, original, () => null)
    return next(e)
  })
}
