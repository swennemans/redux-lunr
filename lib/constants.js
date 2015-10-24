'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _middlewareJs = require('./middleware.js');

/* Load (sub)set of redux state into index.
 Which subset is defined by the arguments passed.
 * */
var LUNR_INDEX_STATE = _middlewareJs.SEARCH_LUNR + 'INDEX_STATE';
exports.LUNR_INDEX_STATE = LUNR_INDEX_STATE;
var LUNR_INDEX_STATE_SUCCESS = _middlewareJs.SEARCH_LUNR + 'INDEX_STATE_SUCCESS';
exports.LUNR_INDEX_STATE_SUCCESS = LUNR_INDEX_STATE_SUCCESS;
/* Load predefined (fetched from server?) array of docs into index
 *  takes this array as argument.
 * */
var LUNR_INDEX_DOCS = _middlewareJs.SEARCH_LUNR + 'INDEX_DOCS';
exports.LUNR_INDEX_DOCS = LUNR_INDEX_DOCS;
var LUNR_INDEX_DOCS_SUCCESS = _middlewareJs.SEARCH_LUNR + 'LOAD_INDEX_DOCS_SUCCESS';

exports.LUNR_INDEX_DOCS_SUCCESS = LUNR_INDEX_DOCS_SUCCESS;
//export const

var LUNR_SEARCH_START = _middlewareJs.SEARCH_LUNR + 'SEARCH_START';
exports.LUNR_SEARCH_START = LUNR_SEARCH_START;
var LUNR_SEARCH_SUCCESS = _middlewareJs.SEARCH_LUNR + 'SEARCH_SUCCESS';
exports.LUNR_SEARCH_SUCCESS = LUNR_SEARCH_SUCCESS;
var LUNR_SEARCH_RESET = _middlewareJs.SEARCH_LUNR + 'SEARCH_RESET';
exports.LUNR_SEARCH_RESET = LUNR_SEARCH_RESET;