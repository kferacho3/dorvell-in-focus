'use client'

import { useCallback } from 'react'

import { timecode } from '@/lib/media/video'

type Chapter = { startSeconds: number; title: string; note?: string | null }

type FilmChaptersProps = {
  /** id of the <video> element these chapters seek. */
  playerId: string
  chapters: Chapter[]
}

/**
 * Chapter markers.
 *
 * Client-side only because seeking requires touching the media element. The
 * enhancement is narrow on purpose: the chapter list is a readable, complete
 * table of contents with timecodes whether or not the click handler ever runs,
 * so a failed chunk costs a convenience, not information.
 *
 * Buttons, not links — this changes playback position on the current page, it
 * does not navigate. Using an anchor here would lie to assistive technology
 * about what happens next.
 */
export function FilmChapters({ playerId, chapters }: FilmChaptersProps) {
  const seek = useCallback(
    (seconds: number) => {
      const player = document.getElementById(playerId)
      if (!(player instanceof HTMLVideoElement)) return

      player.currentTime = seconds

      // Play only if the reader had already started. Jumping to a chapter on a
      // film they have not begun should not start audio unprompted.
      if (!player.paused) return
      if (player.currentTime > 0 && player.readyState >= 2) {
        void player.play().catch(() => {
          /* Autoplay policy refused; the reader can press play. */
        })
      }
    },
    [playerId],
  )

  return (
    <nav className="measure mt-8" aria-label="Film chapters">
      <h2 className="type-meta text-channel-muted">Chapters</h2>
      <ol className="border-channel-rule divide-channel-rule mt-3 divide-y border-t">
        {chapters.map((chapter, index) => (
          <li key={`${chapter.startSeconds}-${index}`}>
            <button
              type="button"
              onClick={() => seek(chapter.startSeconds)}
              className="group flex min-h-11 w-full items-baseline gap-5 py-3 text-left"
            >
              <span className="type-meta text-channel-accent shrink-0 tabular-nums">
                {timecode(chapter.startSeconds)}
              </span>
              <span>
                <span className="type-body block font-medium underline-offset-4 group-hover:underline">
                  {chapter.title}
                </span>
                {chapter.note && (
                  <span className="type-caption block">{chapter.note}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}
