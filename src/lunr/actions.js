import {
    LOAD_DOCS_INTO_INDEX,
    LOAD_STATE_INTO_INDEX,
    LUNR_SEARCH_START,
    } from './constants.js'

import {SEARCH_LUNR} from './middleware.js'

export function loadDocsIntoIndex(docs) {
  return {
    [SEARCH_LUNR]: {
      type: LOAD_DOCS_INTO_INDEX,
      _toIndex: docs
    }
  }
}
export function loadStateIntoIndex(state) {
  return {
    [SEARCH_LUNR]: {
      type: LOAD_STATE_INTO_INDEX
    }
  }
}
export function lunrStartSearch(query, limit) {
  return {
    [SEARCH_LUNR]: {
      type: LUNR_SEARCH_START,
      _query: query,
      _limit: limit
    }
  }
}