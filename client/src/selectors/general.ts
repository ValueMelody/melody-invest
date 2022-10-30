import { RootState } from 'stores'

const selectContent = () => (state: RootState) => {
  return state.content
}

const selectGlobal = () => (state:RootState) => {
  return state.global
}

export {
  selectContent,
  selectGlobal,
}
