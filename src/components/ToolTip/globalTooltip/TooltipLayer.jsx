import { useSelector } from 'react-redux'
import { createPortal } from 'react-dom'
import { selectTooltipData } from '@/redux/slices/tooltipSlice'
import GeneralTooltip from '@/components/Tooltip/miniTooltip/miniTooltip'

export default function TooltipLayer() {
  const { visible, position, content } = useSelector(selectTooltipData)

  if (!visible) return null;
  if (typeof window === 'undefined') return null
  return createPortal(<GeneralTooltip position={position} content={content} ></GeneralTooltip>, document.body)
}
