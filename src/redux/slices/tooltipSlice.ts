import { createSlice, createSelector } from '@reduxjs/toolkit'

interface TooltipState {
  visible: boolean,
  component: string | null,
  anchor: HTMLElement | null,
  position: { x: number, y: number }
  placement: "right" | "left" | "bottom" | "top"
  content: unknown
  options: {
      delay: number;
      interactive: boolean;
  };
}

const initialState : TooltipState = {
  visible: false,
  component: null,
  anchor: null,
  position: { x: 0, y: 0 },
  placement: "bottom",
  content: null,
  options: {
    delay: 300,
    interactive: false
  }

}

const tooltipSlice = createSlice({
  name: 'tooltip',
  initialState,
  reducers: {
    setTooltip: (state, action) => {
      state.position = action.payload.position;
      state.content = action.payload.content;
      state.visible = true;
    },
    hideTooltip: (state) => {
      state.visible = false
    }
  }
})

export const selectTooltipState = (state) => state.tooltip
export const selectVisible = (state) => state.tooltip.visible
export const selectAnchor = (state) => state.tooltip.anchor
export const selectPosition = (state) => state.tooltip.position
export const selectContent = (state) => state.tooltip.content

export const selectTooltipData = createSelector([selectVisible, selectAnchor, selectPosition, selectContent],
  (visible, anchor, position, content) => ({
    visible,
    anchor,
    position,
    content
}))

export const { setTooltip, hideTooltip } = tooltipSlice.actions
export default tooltipSlice.reducer
