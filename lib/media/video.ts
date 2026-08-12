import { isPopulatedMedia, type MediaLike } from '@/lib/media/resolve'

import type { Media } from '@/payload-types'

/**
 * Video source resolution (ADR-0007).
 *
 * The player is provider-independent. When a Mux playback id exists the source
 * is adaptive HLS; otherwise it falls back to the progressive file on the media
 * origin. Swapping providers — or adopting the AWS MediaConvert path instead —
 * changes this module and nothing else.
 */

export type VideoSource = {
  src: string
  type: 'application/x-mpegURL' | 'video/mp4' | 'video/quicktime'
  /** True when the browser can adapt bitrate to the connection. */
  adaptive: boolean
}

export type CaptionTrack = {
  src: string
  label: string
  srcLang: string
}

export type ResolvedVideo = {
  sources: VideoSource[]
  poster: string | null
  captions: CaptionTrack[]
  transcript: string | null
  visualDescription: string | null
  durationSeconds: number | null
  /** `width / height` for the intrinsic box. Prevents layout shift. */
  aspectRatio: string
  isVertical: boolean
  title: string
}

const MUX_STREAM_BASE = 'https://stream.mux.com'

function mimeFor(url: string): VideoSource['type'] {
  if (url.endsWith('.m3u8')) return 'application/x-mpegURL'
  if (url.endsWith('.mov')) return 'video/quicktime'
  return 'video/mp4'
}

/**
 * Parses an aspect string like "16:9" into a CSS ratio, falling back to the
 * record's real pixel dimensions.
 */
function aspectFrom(media: Media): { ratio: string; vertical: boolean } {
  const declared = media.aspectRatio
  if (typeof declared === 'string' && declared.includes(':')) {
    const [w, h] = declared.split(':').map((part) => Number.parseFloat(part))
    if (w && h && Number.isFinite(w) && Number.isFinite(h)) {
      return { ratio: `${w} / ${h}`, vertical: h > w }
    }
  }

  const width = media.width ?? 0
  const height = media.height ?? 0
  if (width > 0 && height > 0) {
    return { ratio: `${width} / ${height}`, vertical: height > width }
  }

  return { ratio: '16 / 9', vertical: false }
}

export function resolveVideo(value: MediaLike): ResolvedVideo | null {
  if (!isPopulatedMedia(value)) return null
  if (value.kind !== 'video') return null

  const sources: VideoSource[] = []

  // Adaptive first. A browser picks the first source it can play, so HLS must
  // precede the progressive file or Safari would never see it.
  if (value.muxPlaybackId && value.processingStatus === 'ready') {
    sources.push({
      src: `${MUX_STREAM_BASE}/${value.muxPlaybackId}.m3u8`,
      type: 'application/x-mpegURL',
      adaptive: true,
    })
  }

  if (value.url) {
    sources.push({ src: value.url, type: mimeFor(value.url), adaptive: false })
  }

  if (sources.length === 0) return null

  const poster =
    typeof value.poster === 'object' && value.poster !== null
      ? (value.poster.url ?? null)
      : null

  const captions: CaptionTrack[] = (value.captions ?? [])
    .map((track) => {
      const file =
        typeof track.file === 'object' && track.file !== null ? track.file : null
      if (!file?.url) return null
      return {
        src: file.url,
        label: track.label ?? 'Captions',
        srcLang: track.srcLang ?? 'en',
      }
    })
    .filter((track): track is CaptionTrack => track !== null)

  const { ratio, vertical } = aspectFrom(value)

  return {
    sources,
    poster,
    captions,
    transcript: value.transcript ?? null,
    visualDescription: value.visualDescription ?? null,
    durationSeconds: value.durationSeconds ?? null,
    aspectRatio: ratio,
    isVertical: vertical,
    title: value.title ?? 'Film',
  }
}

/** Seconds → `m:ss`, for chapter markers and runtimes. */
export function timecode(seconds: number): string {
  const total = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(total / 60)
  return `${minutes}:${String(total % 60).padStart(2, '0')}`
}
