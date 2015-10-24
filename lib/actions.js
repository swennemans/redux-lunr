'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.loadDocsIntoIndex = loadDocsIntoIndex;
exports.loadStateIntoIndex = loadStateIntoIndex;
exports.lunrStartSearch = lunrStartSearch;
exports.lunrResetSearchResults = lunrResetSearchResults;

var _constantsJs = require('./constants.js');

var _middlewareJs = require('./middleware.js');

function loadDocsIntoIndex(docs) {
    return {
        type: _constantsJs.LUNR_INDEX_DOCS,
        _toIndex: docs
    };
}

function loadStateIntoIndex(state) {
    return {
        type: _constantsJs.LUNR_INDEX_STATE
    };
}

function lunrStartSearch(query, limit) {
    return {
        type: _constantsJs.LUNR_SEARCH_START,
        _query: query ? query : false,
        _limit: limit ? limit : false
    };
}

function lunrResetSearchResults() {
    return {
        type: _constantsJs.LUNR_SEARCH_RESET
    };
}