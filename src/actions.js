import {
    LUNR_INDEX_DOCS,
    LUNR_INDEX_STATE,
    LUNR_SEARCH_START,
    } from './constants.js'

import {SEARCH_LUNR} from './middleware.js'

export function loadDocsIntoIndex(docs) {
  return {
    [SEARCH_LUNR]: {
      type: LUNR_INDEX_DOCS,
      _toIndex: docs
    }
  }
}
export function loadStateIntoIndex(state) {
  return {
    [SEARCH_LUNR]: {
      type: LUNR_INDEX_STATE
    }
  }
}
export function lunrStartSearch(query, limit) {
  return {
    [SEARCH_LUNR]: {
      type: LUNR_SEARCH_START,
      _query: query ? query: false,
      _limit: limit ? limit: false
    }
  }
}