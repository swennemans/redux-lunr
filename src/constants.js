import {SEARCH_LUNR} from './middleware.js'

/* Load (sub)set of redux state into index.
 Which subset is defined by the arguments passed.
 * */
export const LUNR_INDEX_STATE = `${SEARCH_LUNR}INDEX_STATE`;
export const LUNR_INDEX_STATE_SUCCESS = `${SEARCH_LUNR}INDEX_STATE_SUCCESS`;
/* Load predefined (fetched from server?) array of docs into index
 *  takes this array as argument.
 * */
export const LUNR_INDEX_DOCS = `${SEARCH_LUNR}INDEX_DOCS`;
export const LUNR_INDEX_DOCS_SUCCESS = `${SEARCH_LUNR}LOAD_INDEX_DOCS_SUCCESS`;

//export const

export const LUNR_SEARCH_START = `${SEARCH_LUNR}SEARCH_START`;
export const LUNR_SEARCH_SUCCESS = `${SEARCH_LUNR}SEARCH_SUCCESS`;
export const LUNR_SEARCH_RESET = `${SEARCH_LUNR}SEARCH_RESET`;