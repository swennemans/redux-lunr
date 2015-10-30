'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = createLunrMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lunr = require('lunr');

var _lunr2 = _interopRequireDefault(_lunr);

var _constantsJs = require('./constants.js');

function UnreconizedActionTypeException(message) {
  this.message = message;
  this.name = 'UnreconizedActionTypeException';
}

/* Simple function that retrieve state based on reducer
 and entity. Arguments should be passed when initing
 middleware. Usually configureStore.js
 */
function getDataFromState(options, getState) {
  var _options$store = options.store;
  var reducer = _options$store.reducer;
  var entity = _options$store.entity;

  return getState()[reducer][entity];
}

function createLunrIndex(options) {
  var index = options.index;

  return (0, _lunr2['default'])(function () {
    var _this = this;

    Object.keys(index).forEach(function (key) {
      if (key === 'ref') {
        _this.ref(index[key]);
      } else {
        _this.field(key, index[key]);
      }
    });
  });
}

/* apply mapper function defined in options, useful when
   you work with nested properties.
 */
function applyMapper(_toIndex, mapper) {
  return _toIndex.map(mapper);
}

/* addToIndex creates an index based on the documents passed saved in _toIndex
 */
function addToIndex(_toIndex, options) {
  var idx = undefined;

  try {
    idx = createLunrIndex(options);
    _toIndex.forEach(function (doc) {
      idx.add(doc);
    });
  } catch (e) {
    throw new Error('Redux-Lunr: Error while indexing. Did you pass an array of valid objects?');
  }
  return idx;
}

/* Add documents to lunr reducer store */
function addToStore(_toIndex) {
  return _toIndex.map(function (doc) {
    return doc;
  });
}

function retrieveResultsFromStore(getState, results) {
  if (results.length > 0) {
    var _ret = (function () {
      var lunrStore = getState().lunr.docs;
      return {
        v: flatten(results.map(function (result) {
          return lunrStore.filter(function (doc) {
            return doc.id === result.ref;
          });
        }))
      };
    })();

    if (typeof _ret === 'object') return _ret.v;
  } else {
    return [];
  }
}

function doLunrSearch(getState, _query) {
  return getState().lunr.searchIndex.search(_query);
}

function retrieveResultsFromState(getState, options, results) {
  if (results.length > 0) {
    var _ret2 = (function () {
      var _options$store2 = options.store;
      var reducer = _options$store2.reducer;
      var entity = _options$store2.entity;

      var store = getState()[reducer][entity];

      return {
        v: flatten(results.map(function (result) {
          return store.filter(function (doc) {
            return doc.id === result.ref;
          });
        }))
      };
    })();

    if (typeof _ret2 === 'object') return _ret2.v;
  } else {
    return [];
  }
}

function flatten(results) {
  return results.reduce(function (a, b) {
    return a.concat(b);
  });
}

function isInt(number) {
  if (typeof number === 'string') {
    return true;
  } else if (!isNaN(number)) {
    return number % 1 !== 0;
  } else {
    return true;
  }
}

var SEARCH_LUNR = '@@REDUX_LUNR/';

exports.SEARCH_LUNR = SEARCH_LUNR;

function createLunrMiddleware(options) {

  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;

    return function (next) {
      return function (action) {

        if (action.type.indexOf(SEARCH_LUNR) == -1) {
          return next(action);
        }

        var searchLunr = action;

        var _toIndex = searchLunr._toIndex;
        var _query = searchLunr._query;
        var _limit = searchLunr._limit;
        var type = searchLunr.type;
        var _index = searchLunr._index;

        var rest = _objectWithoutProperties(searchLunr, ['_toIndex', '_query', '_limit', 'type', '_index']);

        if (!_toIndex instanceof Array) {
          throw new Error('Redux-Lunr: passed documents must be an array of objects');
        }
        if (_toIndex !== undefined && !_toIndex.length > 0) {
          throw new Error('Redux-Lunr: passed documents array is empty');
        }
        if (_query !== undefined && typeof _query !== 'string') {
          throw new Error('Redux-Lunr: search query must be a string!');
        }
        if (_limit !== undefined && isInt(_limit)) {
          throw new Error('Redux-Lunr: search limit must be an integer!');
        }
        //if ( _index !== undefined && ) {
        //  throw new Error('Redux-Lunr: search limit must be an integer!')
        //}

        if (options.store.existingStore && (options.store.reducer === undefined || options.store.entity === undefined)) {
          throw new Error('Redux-Lunr: if using existing Redux Store please define a reducer and an entity');
        }

        var needToMap = options.mapper !== undefined;

        switch (type) {
          case _constantsJs.LUNR_INDEX_DOCS:
            next(searchLunr);

            /* Create and save searchIndex */
            var docsSearchIndex = !needToMap ? addToIndex(_toIndex, options) : addToIndex(applyMapper(_toIndex, options), options.mapper);

            next({
              type: _constantsJs.LUNR_INDEX_DOCS_SUCCESS,
              searchIndex: docsSearchIndex,
              docs: _toIndex
            });
            break;
          case _constantsJs.LUNR_INDEX_STATE:
            next(searchLunr);
            /* Create and save searchIndex */
            var stateSearchIndex = !needToMap ? addToIndex(getDataFromState(options, getState), options) : addToIndex(applyMapper(getDataFromState(options, getState), options), options.mapper);

            //const stateSearchIndex = addToIndex( getDataFromState(options, getState), options );

            next({
              type: _constantsJs.LUNR_INDEX_STATE_SUCCESS,
              searchIndex: stateSearchIndex
            });
            break;
          case _constantsJs.LUNR_SEARCH_START:
            next(searchLunr);
            var results = options.store.existingStore ? retrieveResultsFromState(getState, options, doLunrSearch(getState, _query)) : retrieveResultsFromStore(getState, doLunrSearch(getState, _query));

            next({
              type: _constantsJs.LUNR_SEARCH_SUCCESS,
              results: _limit ? results.slice(0, _limit) : results,
              query: _query
            });
            break;
          case _constantsJs.LUNR_LOAD_SEARCH_INDEX:
            next(searchLunr);
            next({
              type: _constantsJs.LUNR_LOAD_SEARCH_INDEX_SUCCESS,
              searchIndex: _lunr2['default'].index.load(JSON.parse(_index))
            });
            break;
          case _constantsJs.LUNR_SEARCH_RESET:
            next(searchLunr);
            break;
          default:
            throw new UnreconizedActionTypeException('Unknown action, ' + type);
        }
      };
    };
  };
}