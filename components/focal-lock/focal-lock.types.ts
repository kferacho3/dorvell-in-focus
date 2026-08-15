export type FocusTheme =
  'publication' | 'photography' | 'motion' | 'stories' | 'modeling' | 'x'

export type FocusTargetOptions = {
  id: string
  label?: string
  theme?: FocusTheme
  inset?: number
  radius?: number
  priority?: number
  routeDefault?: boolean
  showPoint?: boolean
  disabled?: boolean
}

export type FocusBounds = {
  x: number
  y: number
  width: number
  height: number
  radius: number
  cornerLength: number
}
