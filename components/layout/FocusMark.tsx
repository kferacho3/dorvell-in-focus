import { FergInFocusMark } from '@/components/brand/FergInFocusMark'
import { cn } from '@/lib/utils/cn'

type FocusMarkProps = {
  className?: string
  /** Rendered as the accessible name when the mark stands alone. */
  title?: string
}

/** Backwards-compatible layout export for the canonical supplied brand mark. */
export function FocusMark({ className, title }: FocusMarkProps) {
  return <FergInFocusMark className={className} title={title} />
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
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <FocusMark className="shrink-0 text-[1.65em]" />
      <span className="type-kicker leading-none">
        FERG{' '}
        <span className="font-[family-name:var(--font-display)] text-[1.35em] tracking-[-0.01em] normal-case">
          in focus
        </span>
      </span>
    </span>
  )
}
