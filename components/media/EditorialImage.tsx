import Image from 'next/image'

import {
  SIZES,
  aspectRatio,
  resolveImage,
  type MediaLike,
  type SizesToken,
} from '@/lib/media/resolve'
import { cn } from '@/lib/utils/cn'

type EditorialImageProps = {
  media: MediaLike
  /** Which layout slot this image occupies. Drives the `sizes` attribute. */
  sizes: SizesToken
  /**
   * Set on the one image most likely to be the Largest Contentful Paint.
   *
   * Exactly one per route, and never on anything below the fold. Lazy-loading
   * the real LCP image is a release blocker (plan §14.5), and marking six
   * images priority is the same mistake wearing a different hat — it makes the
   * browser fetch all of them eagerly and none of them arrive sooner.
   */
  priority?: boolean
  className?: string
  imageClassName?: string
  /** Overrides the media record's alt. Use only when context changes meaning. */
  alt?: string
}

/**
 * The governed image layer.
 *
 * Every reader-facing image routes through here — ESLint blocks bare `<img>`
 * precisely so this cannot be bypassed. Centralizing it is what makes accurate
 * `sizes`, intrinsic dimensions, focal-point cropping, and honest alt text
 * properties of the system rather than things each call site remembers.
 */
export function EditorialImage({
  media,
  sizes,
  priority = false,
  className,
  imageClassName,
  alt,
}: EditorialImageProps) {
  const image = resolveImage(media)

  if (!image) {
    // Deliberately visible rather than an invisible gap, so a missing or
    // unpopulated relationship is caught in review instead of in production.
    return (
      <div
        className={cn(
          'border-channel-rule text-channel-muted type-meta flex aspect-[3/2] items-center justify-center border border-dashed',
          className,
        )}
        role="img"
        aria-label="Image unavailable"
      >
        Image unavailable
      </div>
    )
  }

  const ratio = aspectRatio(image)
  const hasIntrinsicSize = image.width > 0 && image.height > 0

  return (
    <figure className={cn('m-0', className)}>
      <div
        className="bg-channel-rule/40 relative overflow-hidden"
        style={ratio ? { aspectRatio: ratio } : undefined}
      >
        {hasIntrinsicSize ? (
          <Image
            src={image.src}
            alt={alt ?? image.alt}
            width={image.width}
            height={image.height}
            sizes={SIZES[sizes]}
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            placeholder={image.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={image.blurDataURL ?? undefined}
            style={{ objectPosition: image.objectPosition }}
            className={cn('h-full w-full object-cover', imageClassName)}
          />
        ) : (
          // Dimensions unknown — `fill` still prevents layout shift because the
          // wrapper carries no ratio and the caller sized it.
          <Image
            src={image.src}
            alt={alt ?? image.alt}
            fill
            sizes={SIZES[sizes]}
            priority={priority}
            style={{ objectPosition: image.objectPosition }}
            className={cn('object-cover', imageClassName)}
          />
        )}
      </div>

      {(image.caption || image.credit) && (
        <figcaption className="type-caption mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {image.caption && <span>{image.caption}</span>}
          {image.credit && (
            // Credit is set in mono so it reads as attribution rather than as
            // part of the caption's editorial voice.
            <span className="type-meta text-channel-muted">{image.credit}</span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
