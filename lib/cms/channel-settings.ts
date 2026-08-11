import {
  CHANNEL_LIST,
  CHANNELS,
  type ChannelDefinition,
  type ChannelKey,
} from '@/lib/channels'

/**
 * Reader-facing channel copy.
 *
 * Every visible label resolves through this module so that renaming a channel
 * is a CMS edit (ADR-0004). Components must never read `fallbackLabel` from
 * `lib/channels` directly — that constant exists only as the last resort when
 * the CMS has no value.
 *
 * The function is `async` today even though it currently returns synchronously.
 * That is on purpose: when this reads the `channelSettings` global through
 * Payload's Local API, no call site has to change.
 */

export type ResolvedChannel = {
  readonly key: ChannelKey
  readonly route: string
  readonly label: string
  readonly tagline: string
  readonly description: string
  /** Internal art-direction concept. Not rendered. */
  readonly concept: string
  /** True while the public name is still undecided. */
  readonly isProvisional: boolean
}

function fromDefinition(definition: ChannelDefinition): ResolvedChannel {
  return {
    key: definition.key,
    route: definition.route,
    label: definition.fallbackLabel,
    tagline: definition.fallbackTagline,
    description: definition.fallbackDescription,
    concept: definition.concept,
    isProvisional: definition.nameStatus === 'provisional',
  }
}

export async function getChannels(): Promise<readonly ResolvedChannel[]> {
  // TODO(PR06): read the `channelSettings` global and merge over these
  // defaults, field by field, so a partially filled global still renders.
  return CHANNEL_LIST.map(fromDefinition)
}

export async function getChannelByKey(key: ChannelKey): Promise<ResolvedChannel> {
  return fromDefinition(CHANNELS[key])
}
