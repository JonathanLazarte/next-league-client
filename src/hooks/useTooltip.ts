import { useDispatch } from 'react-redux'
import { setTooltip, hideTooltip } from '@/redux/slices/tooltipSlice'

export function useTooltip() {
  const dispatch = useDispatch()

  const handleSet = (payload) => dispatch(setTooltip(payload))

  const handleHide = () => dispatch(hideTooltip())

  return {
    set: handleSet,
    hide: handleHide
  }
}
