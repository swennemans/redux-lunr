import test from 'tape';
import * as types from '../src/constants.js';
import reducer from '../src/reducer';

const getInitialState = () => {
  return {
    docs: [],
    results: [],
    loadingStarted: false,
    loadingError: false,
    loadingSuccess: false,
    isSearching: true,
    query: '',
    searchIndex: undefined
  };
};

test('Reducer should return default state', (t) => {
  t.deepEqual(reducer(undefined, {}), getInitialState())
  t.end()
});

test('Reducer should display search results after succesfull search', (t) => {

  const firstState = reducer(getInitialState(), {type: types.LUNR_SEARCH_START});
  const secondState = reducer(undefined, {type: types.LUNR_SEARCH_SUCCESS, results: ["a", "b", "c"]});

  t.ok(firstState.isSearching, "isSearching should be true while searching");
  t.notOk(secondState.isSearching, "isSearching should be false with success");
  t.deepEqual(secondState.results, ["a", "b", "c"], "Search results should be displayed");

  t.end()
});

test('Reducer result should be empty atter LUNR_SEARCH_RESET', (t) => {
  const firstState = reducer({}, {type: types.LUNR_SEARCH_SUCCESS, results: ["a", "b", "c"]});
  const secondState = reducer({}, {type: types.LUNR_SEARCH_RESET});

  t.deepEqual(secondState.results, [], 'Results should return an empty array')
  t.end()
})