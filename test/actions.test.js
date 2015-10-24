import test from 'tape';
import * as actions from '../src/actions.js'
import * as types from '../src/constants.js';

test('It should return correct actions', (t) => {

  const _toIndex = [
    {id: "1", header: "Header 1", body: "body 1"},
    {id: "2", header: "Header 2", body: "body 2"},
    {id: "3", header: "Header 3", body: "body 3"}
  ];

  const expectedActionIndexDocs = {
      type: types.LUNR_INDEX_DOCS,
      _toIndex
  };

  const expectedActionIndexState = {
      type: types.LUNR_INDEX_STATE,
  };

  const expectedActionSearch = {
      type: types.LUNR_SEARCH_START,
      _query: "query",
      _limit: 10
  };

  const expectedActionResetSearchResults = {
    type: types.LUNR_SEARCH_RESET
  };

  t.deepEqual(actions.loadDocsIntoIndex(_toIndex), expectedActionIndexDocs, "loadDocsIntoIndex should return correct action");
  t.deepEqual(actions.loadStateIntoIndex(), expectedActionIndexState, "loadStateIntoIndex should return correct action");
  t.deepEqual(actions.lunrStartSearch("query", 10), expectedActionSearch, "lunrStartSearch should return correct action");
  t.deepEqual(actions.lunrResetSearchResults(), expectedActionResetSearchResults, "lunrResetSearchResults should return correct action");
  t.end()
});
