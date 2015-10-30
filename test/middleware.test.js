import test from 'tape';
import * as types from '../src/constants.js';
import sinon from 'sinon';
import createLunrMiddleware from '../src/middleware.js';
import {SEARCH_LUNR} from '../src/middleware.js'

import {
    loadDocsIntoIndex,
    loadStateIntoIndex
    }
    from '../src/actions.js'

const getStore = (state) => {
  return {
    getState: sinon.stub().returns(state || {}),
    dispatch: sinon.spy()
  };
};

const getState = () => {
  return {
    lunr: {
      searchIndex: {
        search: function() {
          return [{name: "Sven", bio: "ab"}]
        }
      },
      docs: [{name: "Sven", bio: "ab"}, {name: "Tesla", bio: "ad"}]
    }
  }
};

const getOptions = () => {
  return {
    index: {
      ref: 'id',
      name: {boost: 10},
      bio: {},
      interesses: {},
      city: {},
      types: {}
    },
    store: {
      existingStore: false,
      reducer: "profiles",
      entity: "profiles"
    }
  };
}

test('Middleware should return a (middleware) function', (t) => {
  t.ok(typeof createLunrMiddleware() === 'function');
  t.end()
});

test('Middleware only processes actions prefixed with @@REDUX_LUNR/', (t) => {
  const store = getStore();
  const next = sinon.spy();

  const result = createLunrMiddleware({})(store)(next)({
    type: "FOO_BAR"
  });

  t.equal(next.firstCall.args[0].type, "FOO_BAR", "Non redux-lunr action should be nexted");
  t.end()
});

test('Search should work correctly', t => {

  const options = getOptions();
  const state = getState()
  const store = getStore(state);
  const next = sinon.spy();

  const _query = "sv";
  const _limit = 1;


  const result = createLunrMiddleware(options)(store)(next)({
    type: types.LUNR_SEARCH_START,
    _query,
    _limit
  });


  t.equal(next.firstCall.args[0].type, types.LUNR_SEARCH_START, "SEARCH_START should be send to reducer");
  t.equal(next.secondCall.args[0].type, types.LUNR_SEARCH_SUCCESS, "SEARCH_SUCCESS should be send to reducer");
  t.equal(next.secondCall.args[0].results.length, _limit, "Returned results should be limited");

  t.end()

});

test("Middleware should throw errors", t => {
  const state = getState()
  const store = getStore(state);
  const next = sinon.spy();
  const options = getOptions();

  t.plan(6);
  try {
    createLunrMiddleware(options)(store)(next)({
      type: types.LUNR_INDEX_DOCS,
      _toIndex: []
    });
  }
  catch(e) {
    t.ok(e instanceof Error, "Throw error when: passed documents array is empty");
  }

  try {
    createLunrMiddleware(options)(store)(next)({
      type: types.LUNR_SEARCH_START,
      _query: 12,
      _limit: 1
    });
  }
  catch(e) {
    t.ok(e instanceof Error, "Throw error when: query is an integer");
  }

  try {
    createLunrMiddleware(options)(store)(next)({
      type: types.LUNR_SEARCH_START,
      _query: ["foo"],
      _limit: 1
    });
  }
  catch(e) {
    t.ok(e instanceof Error, "Throw error when: query is a an array");
  }

  try {
    createLunrMiddleware(options)(store)(next)({
      type: types.LUNR_SEARCH_START,
      _query: {1: "queryme"},
      _limit: 1
    });
  }
  catch(e) {
    t.ok(e instanceof Error, "Throw error when: when query is a an object");
  }

  try {
    createLunrMiddleware(options)(store)(next)({
      type: types.LUNR_SEARCH_START,
      _query: "query",
      _limit: "5"
    });
  }
  catch(e) {
    t.ok(e instanceof Error, "Throw error when: Limit is a string");
  }
  try {
    createLunrMiddleware(options)(store)(next)({
      type: types.LUNR_SEARCH_START,
      _query: "query",
      _limit: 1.5
    });
  }
  catch(e) {
    t.ok(e instanceof Error, "Throw error when: limit is a float");
  }
});


test("Loading passed array of docs should work properly", t => {

  const options = getOptions();
  const state = getState();
  const store = getStore(state);
  const next = sinon.spy();

  createLunrMiddleware(options)(store)(next)({
    type: types.LUNR_INDEX_DOCS,
    _toIndex: [{}, {}, {}]
  });

  t.equal(next.firstCall.args[0].type, types.LUNR_INDEX_DOCS, "LUNR_INDEX_DOCS should be send to reducer")
  t.equal(next.secondCall.args[0].type, types.LUNR_INDEX_DOCS_SUCCESS, "LUNR_INDEX_DOCS_SUCCESS should be send to reducer")
  t.end()
});

