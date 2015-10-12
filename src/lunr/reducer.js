import {
    LOAD_STATE_INTO_INDEX,
    LOAD_DOCS_INTO_INDEX,
    LUNR_SEARCH_START,
    LOAD_DOCS_SUCCESS,
    LUNR_SEARCH_SUCCESS,
    LOAD_STATE_INTO_INDEX_SUCCESS
    } from './constants.js';

export default function lunr(state = {
  docs: [],
  results: [],
  loadingStarted: false,
  loadingError: false,
  loadingSuccess: false,
  isSearching: true,
  searchIndex: undefined
}, action) {
  switch (action.type) {
    case LOAD_DOCS_INTO_INDEX:
      return Object.assign({}, state, {
        docs: action.docs
      });
    case LOAD_STATE_INTO_INDEX:
      return Object.assign({}, state, {
        loadingStarted: true,
        loadingError: false,
      });
    case LOAD_STATE_INTO_INDEX_SUCCESS:
      return Object.assign({}, state, {
        loadingStarted: false,
        loadingError: false,
        searchIndex: action.searchIndex
      });
    case LOAD_DOCS_SUCCESS:
      return Object.assign({}, state, {
        loadingStarted: false,
        loadingError: false,
        loadingSuccess: true,
        docs: action.docs
      });
    case LUNR_SEARCH_START:
      return Object.assign({}, state, {
        isSearching: true
      });
    case LUNR_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        isSearching: false,
        results: action.results
      });
    default:
      return state;
  }
}