import test from 'tape';
import * as actions from '../actions.js'
import * as types from '../constants.js';
import {SEARCH_LUNR} from '../middleware.js'

test('It should return correct actions', (t) => {

  const _toIndex = [
    {id: "1", header: "Header 1", body: "body 1"},
    {id: "2", header: "Header 2", body: "body 2"},
    {id: "3", header: "Header 3", body: "body 3"}
  ];

  const expectedActionIndexDocs = {
    [SEARCH_LUNR] : {
      type: types.LUNR_INDEX_DOCS,
      _toIndex
    }
  };

  const expectedActionIndexState = {
    [SEARCH_LUNR] : {
      type: types.LUNR_INDEX_STATE,
    }
  };

  const expectedActionSearch = {
    [SEARCH_LUNR] : {
      type: types.LUNR_SEARCH_START,
      _query: "query",
      _limit: 10
    }
  };

  t.deepEqual(actions.loadDocsIntoIndex(_toIndex)[SEARCH_LUNR], expectedActionIndexDocs[SEARCH_LUNR], "loadDocsIntoIndex should return correct action");
  t.deepEqual(actions.loadStateIntoIndex()[SEARCH_LUNR], expectedActionIndexState[SEARCH_LUNR], "loadStateIntoIndex should return correct action");
  t.deepEqual(actions.lunrStartSearch("query", 10)[SEARCH_LUNR], expectedActionSearch[SEARCH_LUNR], "lunrStartSearch should return correct action");
  t.end()
});
