import { cn } from '@/lib/utils/cn'

type FocusMarkProps = {
  className?: string
  /** Rendered as the accessible name when the mark stands alone. */
  title?: string
}

/**
 * The publication mark.
 *
 * Not an aperture icon. The plan is explicit that "focus" should be expressed
 * through framing, depth, and registration rather than a literal lens blade
 * pasted onto every surface (§3.1) — and an aperture glyph is also the single
 * most predictable choice a photography publication could make.
 *
 * This is a focus bracket: the four corner marks a camera draws around the
 * subject it has locked onto, with a center tick. It reads simultaneously as
 * autofocus, as printer's crop marks, and as a frame around whatever it sits
 * next to. It survives at 16px, works in one color, and needs no fill.
 *
 * Decorative by default — the wordmark beside it carries the accessible name.
 */
export function FocusMark({ className, title }: FocusMarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-[1em] w-[1em]', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {/* Four corner brackets — the locked-on frame. */}
      <path d="M2 7.5V2h5.5" />
      <path d="M16.5 2H22v5.5" />
      <path d="M22 16.5V22h-5.5" />
      <path d="M7.5 22H2v-5.5" />
      {/* Center tick. The point of focus. */}
      <path d="M12 10.75v2.5" />
    </svg>
  )
}

/**
 * The full lockup: mark plus wordmark.
 *
 * "IN FOCUS" is set in the display serif against "FERG" in the grotesk, so the
 * name carries the same editorial contrast the publication uses everywhere
 * else rather than relying on a logotype image.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-baseline gap-2.5', className)}>
      <FocusMark className="translate-y-[0.08em] self-center text-[1.15em]" />
      <span className="type-kicker leading-none">
        FERG{' '}
        <span className="font-[family-name:var(--font-display)] text-[1.35em] tracking-[-0.01em] normal-case">
          in focus
        </span>
      </span>
    </span>
  )
}
