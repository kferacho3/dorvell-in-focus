import { ImageResponse } from 'next/og'

import { CHANNELS, isChannelKey } from '@/lib/channels'
import { getStoryBySlug } from '@/lib/cms/queries'
import { OG_SIZE, OG_THEME, fitHeadline } from '@/lib/seo/og-theme'

export const size = OG_SIZE
export const contentType = 'image/png'
export const alt = 'FERG IN FOCUS'

/**
 * Per-story share art.
 *
 * Typographic rather than image-composited, and that is a deliberate trade.
 * Overlaying a headline on a photograph produces unreadable cards about half
 * the time — the crop lands on a bright sky or a busy background and no amount
 * of scrim fixes it without wrecking the image. A card built from the channel
 * palette and the headline is legible every time, at thumbnail size, in a dark
 * or light timeline.
 *
 * The focus-bracket mark, channel label, and rules carry the identity, so the
 * card is recognisably this publication before anyone reads a word.
 */
export default async function StoryOgImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const story = await getStoryBySlug(slug)

  const channelKey = story && isChannelKey(story.channel) ? story.channel : 'publication'
  const theme = OG_THEME[channelKey]
  const channelLabel =
    channelKey === 'publication' ? 'FERG IN FOCUS' : CHANNELS[channelKey].fallbackLabel

  const title = story ? fitHeadline(story.title) : 'FERG IN FOCUS'
  const dek = story?.dek ? fitHeadline(story.dek, 120) : 'Life through a creative lens.'

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: theme.bg,
        color: theme.fg,
        padding: 72,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Masthead */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <FocusBracket color={theme.accent} />
        <span
          style={{
            fontSize: 24,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          Ferg in Focus
        </span>
        <span style={{ flex: 1 }} />
        <span
          style={{
            fontSize: 22,
            letterSpacing: 3,
            color: theme.accent,
            textTransform: 'uppercase',
          }}
        >
          {channelLabel}
        </span>
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontSize: title.length > 55 ? 62 : 82,
            lineHeight: 1.04,
            letterSpacing: -2,
            fontWeight: 600,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{ fontSize: 28, lineHeight: 1.35, color: theme.muted, maxWidth: 860 }}
        >
          {dek}
        </div>
      </div>

      {/* Footer rule */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ height: 2, width: '100%', backgroundColor: theme.accent }} />
        <div
          style={{ display: 'flex', fontSize: 22, letterSpacing: 2, color: theme.muted }}
        >
          <span style={{ textTransform: 'uppercase' }}>Dorvell Ferguson Jr.</span>
          <span style={{ flex: 1 }} />
          {story?.readingMinutes ? (
            <span>{story.readingMinutes} MIN READ</span>
          ) : (
            <span>ferginfocus.com</span>
          )}
        </div>
      </div>
    </div>,
    size,
  )
}

/** The publication mark, drawn inline — Satori cannot fetch an external SVG. */
function FocusBracket({ color }: { color: string }) {
  const stroke = 3
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
      <path d="M2 7.5V2h5.5" stroke={color} strokeWidth={stroke} />
      <path d="M16.5 2H22v5.5" stroke={color} strokeWidth={stroke} />
      <path d="M22 16.5V22h-5.5" stroke={color} strokeWidth={stroke} />
      <path d="M7.5 22H2v-5.5" stroke={color} strokeWidth={stroke} />
      <path d="M12 10.75v2.5" stroke={color} strokeWidth={stroke} />
    </svg>
  )
}
