'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = lunr;

var _constantsJs = require('./constants.js');

function lunr(state, action) {
  if (state === undefined) state = {
    docs: [],
    results: [],
    loadingStarted: false,
    loadingError: false,
    loadingSuccess: false,
    isSearching: true,
    searchIndex: undefined
  };

  switch (action.type) {
    case _constantsJs.LUNR_INDEX_DOCS:
      return Object.assign({}, state, {
        loadingStarted: true,
        loadingError: true,
        loadingSuccess: true
      });
    case _constantsJs.LUNR_INDEX_DOCS_SUCCESS:
      return Object.assign({}, state, {
        loadingStarted: false,
        loadingError: false,
        loadingSuccess: true,
        searchIndex: action.searchIndex,
        docs: action.docs
      });
    case _constantsJs.LUNR_INDEX_STATE:
      return Object.assign({}, state, {
        loadingStarted: true,
        loadingError: false
      });
    case _constantsJs.LUNR_INDEX_STATE_SUCCESS:
      return Object.assign({}, state, {
        loadingStarted: false,
        loadingError: false,
        searchIndex: action.searchIndex
      });
    case _constantsJs.LUNR_SEARCH_START:
      return Object.assign({}, state, {
        isSearching: true
      });
    case _constantsJs.LUNR_SEARCH_SUCCESS:
      return Object.assign({}, state, {
        isSearching: false,
        results: action.results
      });
    default:
      return state;
  }
}

module.exports = exports['default'];