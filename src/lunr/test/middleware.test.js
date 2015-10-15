import test from 'tape';
//import btest from 'blue-tape';
import * as types from '../constants.js';
import sinon from 'sinon';
import {createLunrMiddleware} from '../middleware.js';
import {SEARCH_LUNR} from '../middleware.js'

import {
    loadDocsIntoIndex,
    loadStateIntoIndex
    }
    from '../actions.js'

const options = {
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
  },
  background: false
};

const setup = (options) => {
  let baseDispatch = sinon.spy();
  let dispatch = function dis(action) {
    const methods = {
      dispatch: dis, getState: () => {
      }
    };
    return createLunrMiddleware(options)(methods)(baseDispatch)(action);
  };

  return {
    baseDispatch,
    dispatch
  };
};

const symbolizeAction = (action) => {
  return {
    [SEARCH_LUNR] : action
  }
}


//test('It should return a middleware function', (t) => {
//  t.ok(typeof createLunrMiddleware() === 'function');
//  t.end()
//});

//
//test('It should pass correct action', (t) => {
//  const options = {
//    index: {
//      ref: 'id',
//      name: {boost: 10},
//      bio: {},
//      interesses: {},
//      city: {},
//      types: {}
//    },
//    reducer: "profiles",
//    entity: "profiles",
//    background: false
//  };
//
//  const {baseDispatch, dispatch} = setup(options);
//  const _toIndex = [
//    {id: "1", header: "Header 1", body: "body 1"},
//    {id: "2", header: "Header 2", body: "body 2"},
//    {id: "3", header: "Header 3", body: "body 3"}
//  ];
//
//  const expected = {
//    type: types.LUNR_INDEX_DOCS,
//    _toIndex
//  };
//
//  dispatch(loadDocsIntoIndex(_toIndex));
//  t.ok(typeof baseDispatch === 'function')
//  t.deepEqual(baseDispatch.firstCall.args[0], expected)
//
//  t.end()
//});

test('LunrSearch should work correctly', t => {
  const state = {
    lunr: {
      searchIndex: {
        search: function() {return [{name: "Sven", bio: "ab"}]}
      },
      docs: [{name: "Sven", bio: "ab"}, {name: "Tesla", bio: "ad"}]
    }
  };
  const store = {
    getState: sinon.stub().returns(state),
    dispatch: sinon.spy()
  };
  const next = sinon.spy();

  const _query = "sv";
  const _limit = 1;


  const result = createLunrMiddleware(options)(store)(next)(symbolizeAction({
    type: types.LUNR_SEARCH_START,
    _query,
    _limit
  }));


  t.equal(store.dispatch.firstCall.args[0].type, types.LUNR_SEARCH_SUCCESS, "Next action should be called");
  t.equal(store.dispatch.firstCall.args[0].results.length, _limit, "Returned results should be limited");

  t.end()

});

test("Middleware should throw errors", t => {
  const state = {
    lunr: {
      searchIndex: {
        search: function() {return [{name: "Sven", bio: "ab"}]}
      },
      docs: [{name: "Sven", bio: "ab"}, {name: "Tesla", bio: "ad"}]
    }
  };
  const store = {
    getState: sinon.stub().returns(state),
    dispatch: sinon.spy()
  };
  const next = sinon.spy();


  try {
    createLunrMiddleware(options)(store)(next)(symbolizeAction({
      type: types.LUNR_SEARCH_START,
      _query: 12,
      _limit: 1
    }));
  }
  catch(e) {
    t.ok(e instanceof Error, "Query can't be an integer");
  }

  try {
    createLunrMiddleware(options)(store)(next)(symbolizeAction({
      type: types.LUNR_SEARCH_START,
      _query: ["lol"],
      _limit: 1
    }));
  }
  catch(e) {
    t.ok(e instanceof Error, "Query can't be an array");
  }

  try {
    createLunrMiddleware(options)(store)(next)(symbolizeAction({
      type: types.LUNR_SEARCH_START,
      _query: {1: "queryme"},
      _limit: 1
    }));
  }
  catch(e) {
    t.ok(e instanceof Error, "Query can't be an object");
  }

  try {
    createLunrMiddleware(options)(store)(next)(symbolizeAction({
      type: types.LUNR_SEARCH_START,
      _query: "query",
      _limit: "5"
    }));
  }
  catch(e) {
    t.ok(e instanceof Error, "Limit can't be a string");
  }

  try {
    createLunrMiddleware(options)(store)(next)(symbolizeAction({
      type: types.LUNR_SEARCH_START,
      _query: "query",
      _limit: 1.5
    }));
  }
  catch(e) {
    t.ok(e instanceof Error, "Limit can't be float");
  }
  t.end()
});

