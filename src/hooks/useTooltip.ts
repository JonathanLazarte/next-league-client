import { useDispatch } from 'react-redux'
import { setTooltip, hideTooltip } from '@/redux/slices/tooltipSlice'

export function useTooltip() {
  const dispatch = useDispatch()

  return {
    set: (payload) => dispatch(setTooltip(payload)),
    hide: () => dispatch(hideTooltip())
  }
}
