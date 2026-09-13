import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'



interface TooltipState {
  visible: boolean,
  component: string | null,
  anchor: HTMLElement | null,
  position: { x: number, y: number }
  placement: "right" | "left" | "bottom" | "top"
  content: string | null,
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
    setTooltip: (state, action: PayloadAction<{ position: { x:number, y:number }, content: string, visible: boolean}>) => {
      state.position = action.payload.position;
      state.content = action.payload.content;
      state.visible = true;
    },
    hideTooltip: (state) => {
      state.visible = false
    }
  }
})

export const selectTooltipState = (state: { tooltip: TooltipState}) => state.tooltip
export const selectVisible = (state: { tooltip: TooltipState}) => state.tooltip.visible
export const selectAnchor = (state: { tooltip: TooltipState}) => state.tooltip.anchor
export const selectPosition = (state: { tooltip: TooltipState}) => state.tooltip.position
export const selectContent = (state: { tooltip: TooltipState}) => state.tooltip.content

export const selectTooltipData = createSelector([selectVisible, selectAnchor, selectPosition, selectContent],
  (visible, anchor, position, content) => ({
    visible,
    anchor,
    position,
    content
}))

export const { setTooltip, hideTooltip } = tooltipSlice.actions
export default tooltipSlice.reducer
