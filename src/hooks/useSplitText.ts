export type SplitMode = 'chars' | 'words'

export interface SplitItem {
  content: string
  className: string
  key: number
}

export function useSplitText(text: string, mode: SplitMode = 'chars'): SplitItem[] {
  const items = mode === 'chars' ? text.split('') : text.split(' ')
  const className = mode === 'chars' ? 'name-char' : 'desc-word'

  return items.map((item, i) => ({
    content: item === ' ' ? '\u00A0' : item,
    className,
    key: i,
  }))
}
