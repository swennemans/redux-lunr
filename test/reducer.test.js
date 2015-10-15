import test from 'tape';
import * as types from '../constants.js';
import reducer from '../reducer';

test('It should return default state with no action', (t) => {
  const initialState = {
    docs: [],
    results: [],
    loadingStarted: false,
    loadingError: false,
    loadingSuccess: false,
    isSearching: true,
    searchIndex: undefined
  };

  const action = {
    type: "UNKNOWN"
  };
  t.deepEqual(reducer(undefined, action), initialState)
  t.end()
});

test('It should display search results after search', (t) => {

  const firstState = reducer(undefined, {type: "LUNR_SEARCH_START"});
  const secondState = reducer(undefined, {type: "LUNR_SEARCH_SUCCESS", results: ["a", "b", "c"]});

  t.ok(firstState.isSearching, "isSearching should be true while searching");
  t.notOk(secondState.isSearching, "isSearching should be false with success");
  t.deepEqual(secondState.results, ["a", "b", "c"], "Search results should be displayed");

  t.end()
});
