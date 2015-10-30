import {
    LUNR_INDEX_DOCS,
    LUNR_INDEX_STATE,
    LUNR_SEARCH_START,
    LUNR_SEARCH_RESET,
    LUNR_LOAD_SEARCH_INDEX
} from './constants.js'

import {SEARCH_LUNR} from './middleware.js'

export function loadDocsIntoIndex(docs) {
  return {
      type: LUNR_INDEX_DOCS,
      _toIndex: docs
  }
}
export function loadStateIntoIndex(state) {
  return {
      type: LUNR_INDEX_STATE
    }
}
export function loadPreparedIndexIntoIndex(index) {
  return {
    type: LUNR_LOAD_SEARCH_INDEX,
    _index: index
  }
}
export function lunrStartSearch(query, limit) {
  return {
      type: LUNR_SEARCH_START,
      _query: query ? query: false,
      _limit: limit ? limit: false
  }
}
export function lunrResetSearchResults() {
  return {
      type: LUNR_SEARCH_RESET
  }
}