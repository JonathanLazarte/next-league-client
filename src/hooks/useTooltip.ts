import { useDispatch, useSelector } from 'react-redux'
import { setTooltip, hideTooltip, selectTooltipData } from '@/redux/slices/tooltipSlice'

export function useTooltip() {
  const dispatch = useDispatch()
  const tooltip = useSelector(selectTooltipData)

  const handleSet = (payload) => dispatch(setTooltip(payload))

  const handleHide = () => dispatch(hideTooltip())

  return {
    ...tooltip,
    set: handleSet,
    hide: handleHide
  }
}
