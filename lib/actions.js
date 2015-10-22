'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.loadDocsIntoIndex = loadDocsIntoIndex;
exports.loadStateIntoIndex = loadStateIntoIndex;
exports.lunrStartSearch = lunrStartSearch;
exports.lunrResetSearchResults = lunrResetSearchResults;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _constantsJs = require('./constants.js');

var _middlewareJs = require('./middleware.js');

function loadDocsIntoIndex(docs) {
  return _defineProperty({}, _middlewareJs.SEARCH_LUNR, {
    type: _constantsJs.LUNR_INDEX_DOCS,
    _toIndex: docs
  });
}

function loadStateIntoIndex(state) {
  return _defineProperty({}, _middlewareJs.SEARCH_LUNR, {
    type: _constantsJs.LUNR_INDEX_STATE
  });
}

function lunrStartSearch(query, limit) {
  return _defineProperty({}, _middlewareJs.SEARCH_LUNR, {
    type: _constantsJs.LUNR_SEARCH_START,
    _query: query ? query : false,
    _limit: limit ? limit : false
  });
}

function lunrResetSearchResults() {
  return _defineProperty({}, _middlewareJs.SEARCH_LUNR, {
    type: _constantsJs.LUNR_SEARCH_RESET
  });
}