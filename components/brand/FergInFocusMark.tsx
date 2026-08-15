import { cn } from '@/lib/utils/cn'

type FergInFocusMarkProps = {
  className?: string
  /** Decorative by default; provide a title only when the mark stands alone. */
  title?: string
  /** The public mark carries the red focus point. */
  showPoint?: boolean
}

/**
 * The canonical FERG IN FOCUS symbol, drawn from the supplied monochrome SVG.
 * Keeping the paths inline lets the mark inherit the current channel ink and
 * gives the four brackets independent, restrained interaction states.
 */
export function FergInFocusMark({
  className,
  title,
  showPoint = true,
}: FergInFocusMarkProps) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={cn('ferg-mark h-[1em] w-[1em]', className)}
      fill="none"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <g
        stroke="currentColor"
        strokeWidth="28"
        strokeLinecap="square"
        strokeLinejoin="miter"
      >
        <path className="ferg-mark__corner ferg-mark__corner--tl" d="M188 96H96v92" />
        <path className="ferg-mark__corner ferg-mark__corner--tr" d="M324 96h92v92" />
        <path className="ferg-mark__corner ferg-mark__corner--br" d="M416 324v92h-92" />
        <path className="ferg-mark__corner ferg-mark__corner--bl" d="M188 416H96v-92" />
        <path d="M238 350V166h104" />
        <path d="M238 244h78" />
      </g>
      {showPoint ? (
        <circle className="ferg-mark__point" cx="184" cy="178" r="14" fill="#ff2a2a" />
      ) : null}
    </svg>
  )
}
