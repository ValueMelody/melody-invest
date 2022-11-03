import { ContentState } from 'stores/content'
import { GlobalState } from 'stores/global'

const selectContent = () => (state: AppState): ContentState => {
  return state.content
}

const selectGlobal = () => (state: AppState): GlobalState => {
  return state.global
}

export {
  selectContent,
  selectGlobal,
}
