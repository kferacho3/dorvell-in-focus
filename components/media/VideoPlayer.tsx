import { resolveVideo, timecode } from '@/lib/media/video'
import { cn } from '@/lib/utils/cn'

import { FilmChapters } from './FilmChapters'

import type { MediaLike } from '@/lib/media/resolve'

type Chapter = { startSeconds: number; title: string; note?: string | null }

type VideoPlayerProps = {
  media: MediaLike
  caption?: string | null
  chapters?: Chapter[]
  /** A short silent loop. Never used for a film with sound. */
  loop?: boolean
  className?: string
  /** Stable id so chapter buttons can find this player. */
  playerId?: string
}

/**
 * The film player.
 *
 * Native `<video controls>` rather than a custom control surface. That is a
 * deliberate accessibility decision, not laziness: the browser's own controls
 * are keyboard operable, screen-reader labelled, respect OS captions styling,
 * expose picture-in-picture and playback speed, and work identically before
 * hydration. Custom controls are where video accessibility usually breaks.
 *
 * `preload="none"` with a poster means the poster renders immediately and not a
 * byte of video is fetched until the reader asks for it (plan §3.6, §8.9).
 *
 * A vertical film is shown at its true 9:16 ratio, height-capped so it does not
 * take three screens — never letterboxed into a fake phone mockup. The device
 * is not part of the story.
 */
export function VideoPlayer({
  media,
  caption,
  chapters,
  loop = false,
  className,
  playerId,
}: VideoPlayerProps) {
  const video = resolveVideo(media)

  if (!video) {
    return (
      <div
        className={cn(
          'border-channel-rule text-channel-muted type-meta flex aspect-video items-center justify-center border border-dashed',
          className,
        )}
        role="img"
        aria-label="Video unavailable"
      >
        Video unavailable
      </div>
    )
  }

  const id = playerId ?? `player-${Math.abs(hash(video.sources[0]!.src))}`
  const hasSound = !loop

  return (
    <figure className={cn('m-0', className)}>
      <div
        className={cn(
          'bg-channel-fg/5 relative mx-auto w-full',
          video.isVertical && 'max-w-[26rem]',
        )}
        style={{ aspectRatio: video.aspectRatio }}
      >
        <video
          id={id}
          className="h-full w-full"
          // Never autoplay with sound. A muted decorative loop may autoplay,
          // and even then it still gets controls so it can be stopped.
          controls
          preload="none"
          playsInline
          poster={video.poster ?? undefined}
          muted={loop}
          loop={loop}
          autoPlay={loop}
          aria-label={video.title}
        >
          {video.sources.map((source) => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}

          {video.captions.map((track, index) => (
            <track
              key={track.src}
              kind="captions"
              src={track.src}
              srcLang={track.srcLang}
              label={track.label}
              default={index === 0}
            />
          ))}

          {/* Reached only if the browser cannot play any source at all. */}
          <p className="type-caption p-4">
            Your browser cannot play this film.{' '}
            <a
              href={video.sources.at(-1)!.src}
              download
              className="underline underline-offset-2"
            >
              Download the file
            </a>
            {video.transcript ? ' or read the transcript below.' : '.'}
          </p>
        </video>
      </div>

      {(caption || video.durationSeconds) && (
        <figcaption className="type-caption mt-3 flex flex-wrap items-baseline gap-x-3">
          {caption && <span>{caption}</span>}
          {video.durationSeconds && (
            <span className="type-meta text-channel-muted">
              {timecode(video.durationSeconds)}
            </span>
          )}
          {video.captions.length === 0 && hasSound && (
            // Surfaced rather than hidden. A film with sound and no captions is
            // an accessibility gap, and the editor should see it.
            <span className="type-meta text-channel-muted">No captions available</span>
          )}
        </figcaption>
      )}

      {chapters && chapters.length > 0 && (
        <FilmChapters playerId={id} chapters={chapters} />
      )}

      {video.visualDescription && (
        <section className="measure mt-8">
          <h2 className="type-meta text-channel-muted">What happens</h2>
          {/* Essential for a dialogue-free film — captions carry nothing when
              there is no dialogue to caption (plan §12.3). */}
          <p className="type-body mt-3">{video.visualDescription}</p>
        </section>
      )}

      {video.transcript && (
        <details className="measure border-channel-rule mt-6 border-t pt-4">
          <summary className="type-kicker cursor-pointer">Transcript</summary>
          <div className="type-body mt-4 whitespace-pre-line">{video.transcript}</div>
        </details>
      )}
    </figure>
  )
}

/** Small stable hash, so a generated player id is deterministic across renders. */
function hash(value: string): number {
  let out = 0
  for (let i = 0; i < value.length; i += 1) {
    out = (out << 5) - out + value.charCodeAt(i)
    out |= 0
  }
  return out
}
