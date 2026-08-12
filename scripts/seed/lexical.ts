/**
 * Minimal Lexical document builders.
 *
 * Payload stores rich text as a Lexical editor state, not HTML. Seeding needs
 * to produce that shape without booting an editor, so these build the smallest
 * valid node trees the renderer accepts.
 *
 * Only paragraphs and headings are supported on purpose — seeded copy is plain
 * prose, and a partial rich-text implementation that silently drops formatting
 * would be worse than one that never claims to handle it.
 */

type TextNode = {
  type: 'text'
  text: string
  format: number
  style: string
  mode: 'normal'
  detail: number
  version: 1
}

type ElementNode = {
  type: string
  children: TextNode[]
  format: ''
  indent: 0
  version: 1
  direction: 'ltr'
  textFormat?: number
  tag?: string
}

export type LexicalDocument = {
  root: {
    type: 'root'
    children: ElementNode[]
    format: ''
    indent: 0
    version: 1
    direction: 'ltr'
  }
}

function text(value: string): TextNode {
  return {
    type: 'text',
    text: value,
    format: 0,
    style: '',
    mode: 'normal',
    detail: 0,
    version: 1,
  }
}

export function paragraph(value: string): ElementNode {
  return {
    type: 'paragraph',
    children: [text(value)],
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    textFormat: 0,
  }
}

export function heading(value: string, tag: 'h2' | 'h3' = 'h2'): ElementNode {
  return {
    type: 'heading',
    tag,
    children: [text(value)],
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
  }
}

/** Builds a document from mixed paragraph strings and heading nodes. */
export function doc(...nodes: (string | ElementNode)[]): LexicalDocument {
  return {
    root: {
      type: 'root',
      children: nodes.map((node) => (typeof node === 'string' ? paragraph(node) : node)),
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
    },
  }
}
