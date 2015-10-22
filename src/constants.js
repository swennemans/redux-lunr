/* Load (sub)set of redux state into index.
 Which subset is defined by the arguments passed.
 * */
export const LUNR_INDEX_STATE = 'LUNR_INDEX_STATE';
export const LUNR_INDEX_STATE_SUCCESS = 'LUNR_INDEX_STATE_SUCCESS';
/* Load predefined (fetched from server?) array of docs into index
 *  takes this array as argument.
 * */
export const LUNR_INDEX_DOCS = 'LUNR_INDEX_DOCS';
export const LUNR_INDEX_DOCS_SUCCESS = 'LOAD_INDEX_DOCS_SUCCESS';

//export const

export const LUNR_SEARCH_START = 'LUNR_SEARCH_START';
export const LUNR_SEARCH_SUCCESS = 'LUNR_SEARCH_SUCCESS';
export const LUNR_SEARCH_RESET = 'LUNR_SEARCH_RESET';