import { ReactNode, ElementType, ComponentPropsWithoutRef } from 'react'
import { useMagnetic } from '../hooks/useMagnetic'

type MagneticProps<T extends ElementType> = {
  as?: T
  children: ReactNode
  strength?: number
  className?: string
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>

/**
 * Wraps any element (button, a, div...) with a subtle magnetic-follow
 * effect on hover. Use for CTAs, nav links, social icons.
 */
export default function Magnetic<T extends ElementType = 'div'>({
  as,
  children,
  strength = 0.35,
  className = '',
  ...rest
}: MagneticProps<T>) {
  const Comp = (as || 'div') as ElementType
  const ref = useMagnetic<HTMLElement>(strength)

  return (
    <Comp ref={ref} className={`inline-block will-change-transform ${className}`} {...rest}>
      {children}
    </Comp>
  )
}
