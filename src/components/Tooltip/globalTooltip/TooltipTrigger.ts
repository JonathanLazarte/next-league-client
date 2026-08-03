import { useTooltip } from '@/hooks/useTooltip'
import { useRef } from 'react'
import useHoverIntent from '@/hooks/useHoverIntent'

export default function TooltipTrigger() {
  const ref = useRef(null)
  const tooltip = useTooltip()
  const { start, end, cancel } = useHoverIntent({
    resetAfter: 300
  })



  const getTriggerProps = ({ content }) => {
    const handleMouseEnter = (e) => {

      const el = e.currentTarget.getBoundingClientRect();
      const startAction = () => {
        tooltip.set({
          position: { x: el.left + el.width / 2, y: el.bottom },
          content
        })
      }
      start({ cb: startAction, isTooltipOpened: false })
    }

    const handleMouseLeave = () => {
      end(() => tooltip.hide())
    }
    return {
      ref,
      onMouseEnter : (e) => handleMouseEnter(e),
      onMouseLeave : handleMouseLeave
    }
  }

  return getTriggerProps
}
