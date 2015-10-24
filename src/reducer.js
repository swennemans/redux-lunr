import {
    LUNR_INDEX_STATE,
    LUNR_INDEX_DOCS,
    LUNR_INDEX_DOCS_SUCCESS,
    LUNR_SEARCH_START,
    LUNR_SEARCH_SUCCESS,
    LUNR_INDEX_STATE_SUCCESS,
    LUNR_SEARCH_RESET
    } from './constants.js';

import { SEARCH_LUNR } from './middleware.js'

export default function lunr(state = {
  docs: [],
  results: [],
  query: "",
  loadingStarted: false,
  loadingError: false,
  loadingSuccess: false,
  isSearching: true,
  searchIndex: undefined
}, action) {
  switch (action.type) {
    case LUNR_INDEX_DOCS:
      return Object.assign({}, state, {
        loadingStarted: true,
        loadingError: true,
        loadingSuccess: true
      });
    case LUNR_INDEX_DOCS_SUCCESS:
      return Object.assign({}, state, {
        loadingStarted: false,
        loadingError: false,
        loadingSuccess: true,
        searchIndex: action.searchIndex,
        docs: action.docs
      });
    case LUNR_INDEX_STATE:
      return Object.assign({}, state, {
        loadingStarted: true,
        loadingError: false,
      });
    case LUNR_INDEX_STATE_SUCCESS:
      return Object.assign({}, state, {
        loadingStarted: false,
        loadingError: false,
        searchIndex: action.searchIndex
      });
    case LUNR_SEARCH_START:
      return Object.assign({}, state, {
        query: action._query,
        isSearching: true
      });
    case LUNR_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        isSearching: false,
        results: action.results
      });
    case LUNR_SEARCH_RESET:
      return Object.assign({}, state, {
        isSearching: false,
        results: []
      });
    default:
      return state;
  }
}