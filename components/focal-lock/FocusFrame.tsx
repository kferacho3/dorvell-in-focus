'use client'

import { forwardRef } from 'react'

export const FocusFrame = forwardRef<HTMLDivElement>(function FocusFrame(_, ref) {
  return (
    <div ref={ref} className="focus-frame" aria-hidden="true" data-point="false">
      <span className="focus-frame__corner focus-frame__corner--tl" />
      <span className="focus-frame__corner focus-frame__corner--tr" />
      <span className="focus-frame__corner focus-frame__corner--br" />
      <span className="focus-frame__corner focus-frame__corner--bl" />
      <span className="focus-frame__point" />
      <span className="focus-frame__label" />
    </div>
  )
})
