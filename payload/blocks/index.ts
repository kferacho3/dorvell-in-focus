import { MEDIA_BLOCKS } from './media'
import { MOTION_BLOCKS } from './motion'
import { RELATIONSHIP_BLOCKS } from './relationship'
import { TEXT_BLOCKS } from './text'

import type { Block } from 'payload'

export * from './media'
export * from './motion'
export * from './relationship'
export * from './text'

/**
 * The full story block library.
 *
 * Ordered by how often an editor reaches for each group, not alphabetically —
 * the block picker is a working tool, and text comes first because most
 * paragraphs are text.
 */
export const STORY_BLOCKS: Block[] = [
  ...TEXT_BLOCKS,
  ...MEDIA_BLOCKS,
  ...MOTION_BLOCKS,
  ...RELATIONSHIP_BLOCKS,
]
