import test from 'tape';
import btest from 'blue-tape';
import * as types from '../constants.js';
import sinon from 'sinon';
import lunrMiddleware from '../middleware.js';

import {
    loadDocsIntoIndex,
    loadStateIntoIndex
    }
    from '../actions.js'

const setup = (options) => {
  let baseDispatch = sinon.spy()
  let dispatch = function dis(action) {
    const methods = {
      dispatch: dis, getState: () => {
      }
    };
    return lunrMiddleware(options)(methods)(baseDispatch)(action);
  };

  return {
    baseDispatch,
    dispatch
  };


}


test('It should return a middleware function', (t) => {
  t.ok(typeof lunrMiddleware() === 'function');
  t.end()
});


test('It should pass correct action', (t) => {
  const options = {
    index: {
      ref: 'id',
      name: {boost: 10},
      bio: {},
      interesses: {},
      city: {},
      types: {}
    },
    reducer: "profiles",
    entity: "profiles",
    background: false
  };

  const {baseDispatch, dispatch} = setup(options);
  const _toIndex = [
    {id: "1", header: "Header 1", body: "body 1"},
    {id: "2", header: "Header 2", body: "body 2"},
    {id: "3", header: "Header 3", body: "body 3"}
  ];

  const expected = {
    type: types.LUNR_INDEX_DOCS,
    _toIndex
  };

  dispatch(loadDocsIntoIndex(_toIndex));
  t.ok(typeof baseDispatch === 'function')
  t.deepEqual(baseDispatch.firstCall.args[0], expected)

  t.end()

})