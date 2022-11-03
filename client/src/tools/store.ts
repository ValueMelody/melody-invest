export const _updateForTest = (
  state: any,
  action: any,
) => {
  Object.keys(action.payload).forEach((key) => {
    state[key] = action.payload[key]
  })
}

export const _resetForTest = (
  state: any,
  initState: any,
) => {
  Object.keys(initState).forEach((key) => {
    state[key] = initState[key]
  })
}
