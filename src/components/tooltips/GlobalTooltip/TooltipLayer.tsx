'use client'
import { createPortal } from 'react-dom'
import { useTooltip } from '@/hooks/useTooltip'
import GeneralTooltip from '@/components/tooltips/TextTooltip/TextTooltip'

export default function TooltipLayer() {
  const { visible, position, content } = useTooltip()

  if (!visible) return null;
  if (typeof window === 'undefined') return null
  return createPortal(<GeneralTooltip position={position} content={content} ></GeneralTooltip>, document.body)
}
