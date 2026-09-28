import type MarkdownIt from 'markdown-it'

export interface ChangelogFormatOptions {
  hideAssetSelectionTip?: boolean
  stripChecksums?: boolean
}

function convertCallouts(md: MarkdownIt, input: string, options: ChangelogFormatOptions): string {
  return input.replace(
    /^> \[!(TIP|NOTE|IMPORTANT|WARNING|CAUTION)\]\r?\n((?:^>.*\r?\n?)+)/gim,
    (_match, typeRaw: string, block: string) => {
      const type = (typeRaw as string).toUpperCase()
      const map: Record<string, { cls: string, title: string }> = {
        TIP: { cls: 'tip', title: 'TIP' },
        NOTE: { cls: 'info', title: 'INFO' },
        IMPORTANT: { cls: 'warning', title: 'WARNING' },
        WARNING: { cls: 'warning', title: 'WARNING' },
        CAUTION: { cls: 'danger', title: 'DANGER' },
      }
      const { cls, title } = map[type] ?? map.TIP
      const text = block
        .split(/\r?\n/)
        .map((l: string) => l.replace(/^>\s?/, ''))
        .join('\n')
        .replace(/###\s*/, '')
        .trim()
      if (options.hideAssetSelectionTip && type === 'TIP' && /if you are unsure which version to download/i.test(text))
        return ''
      const inner = md.render(text).trim()
      return `\n\n<div class="${cls} custom-block"><p class="custom-block-title">${title}</p>${inner}</div>\n\n`
    },
  )
}

export function formatChangelog(md: MarkdownIt, body: string | null | undefined, options: ChangelogFormatOptions = {}): string {
  const base = body ?? 'No changelog provided.'
  const text = options.stripChecksums
    ? base.split(/---\r\n\r\n### Checksums|---\r\n\r\nMD5/)[0]
    : base

  const flavored = text
    .replace(/<!-->/g, '')
    .trim()

  const withCallouts = convertCallouts(md, flavored, options)
  return md.render(withCallouts)
}
