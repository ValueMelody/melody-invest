const selectContent = () => (state: AppState) => {
  return state.content
}

const selectGlobal = () => (state: AppState) => {
  return state.global
}

export {
  selectContent,
  selectGlobal,
}
