import { useDispatch, useSelector } from 'react-redux'
import { setTooltip, hideTooltip, selectTooltipData } from '@/redux/slices/tooltipSlice'
import { SECTION_LABELS } from '@/utils/constants'

export function useTooltip() {
  const dispatch = useDispatch()
  const tooltip = useSelector(selectTooltipData)

  const handleSet = (payload: { position: { x:number, y:number }, content: string }) => dispatch(setTooltip(payload))

  const handleHide = () => dispatch(hideTooltip())

  return {
    ...tooltip,
    set: handleSet,
    hide: handleHide
  }
}
