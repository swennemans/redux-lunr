'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createLunrMiddleware = createLunrMiddleware;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _lunr = require('lunr');

var _lunr2 = _interopRequireDefault(_lunr);

var _constantsJs = require('./constants.js');

var Worker = require("./worker.wrk.js");

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

  console.log(getState()[reducer][entity]);

  return getState()[reducer][entity];
}

function createLunrIndex(options) {
  var index = options.index;

  return (0, _lunr2['default'])(function () {
    var _this = this;

    Object.keys(index).forEach(function (key) {
      if (key === 'ref') {
        console.log('key is', index[key]);
        _this.ref(index[key]);
      } else {
        _this.field(key, index[key]);
      }
    });
  });
}

/* addToIndex creates an index based on the documents passed saved in _toIndex
 * options has background var with true/false. If true, index will be created in background thread
 * default is false.
 */
function addToIndex(_toIndex, options) {
  var background = options.background;

  /* Wrap in promise because webworker returns async */
  return new Promise(function (resolve, reject) {
    if (!background) {
      (function () {
        var idx = createLunrIndex(options);
        _toIndex.forEach(function (doc) {
          idx.add(doc);
        });
        resolve(idx);
      })();
    } else if (background) {
      var worker = new Worker();
      worker.onmessage = function (e) {
        resolve(_lunr2['default'].Index.load(JSON.parse(e.data)));
      };
      worker.postMessage(JSON.stringify({ options: options, _toIndex: _toIndex }));
    } else {
      reject({ err: "Redux-Lunr: unknow indexing option passed" });
    }
  });
}

/* Add documents to lunr reducer store */
function addToStore(_toIndex) {
  return _toIndex.map(function (doc) {
    return doc;
  });
}

function retrieveResultsFromStore(getState, results) {
  if (results.length > 0) {
    var _ret2 = (function () {
      var lunrStore = getState().lunr.docs;
      return {
        v: flatten(results.map(function (result) {
          return lunrStore.filter(function (doc) {
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

function doLunrSearch(getState, _query) {
  return getState().lunr.searchIndex.search(_query);
}

function retrieveResultsFromState(getState, options, results) {
  if (results.length > 0) {
    var _ret3 = (function () {
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

    if (typeof _ret3 === 'object') return _ret3.v;
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

var SEARCH_LUNR = Symbol('Lunr Search');

exports.SEARCH_LUNR = SEARCH_LUNR;

function createLunrMiddleware(options) {

  return function (_ref) {
    var dispatch = _ref.dispatch;
    var getState = _ref.getState;

    return function (next) {
      return function (action) {

        var searchLunr = action[SEARCH_LUNR];
        if (typeof searchLunr === 'undefined') {
          return next(action);
        }

        var _toIndex = searchLunr._toIndex;
        var _query = searchLunr._query;
        var _limit = searchLunr._limit;
        var type = searchLunr.type;

        var rest = _objectWithoutProperties(searchLunr, ['_toIndex', '_query', '_limit', 'type']);

        if (!_toIndex instanceof Array) {
          throw new Error('Redux-Lunr: passed documents must be an array of objects');
        }
        if (_query !== undefined && typeof _query !== 'string') {
          throw new Error('Redux-Lunr: search query must be a string!');
        }
        if (_limit !== undefined && isInt(_limit)) {
          throw new Error('Redux-Lunr: search limit must be an integer!');
        }

        if (options.store.existingStore && (options.store.reducer === undefined || options.store.entity === undefined)) {
          throw new Error('Redux-Lunr: if using existing Redux Store please define a reducer and an entity');
        }

        function actionWith(data) {
          var finalAction = Object.assign({}, action, data);
          delete finalAction[SEARCH_LUNR];
          return finalAction;
        }

        switch (type) {
          case _constantsJs.LUNR_INDEX_DOCS:
            next(actionWith(searchLunr));

            addToIndex(_toIndex, options).then(function (value) {
              console.log('succes', value);
              //let docs = addToStore(value)
              dispatch({
                type: _constantsJs.LUNR_INDEX_DOCS_SUCCESS,
                searchIndex: value,
                docs: _toIndex
              });
            })['catch'](function (err) {
              throw new Error(err);
            });
            break;
          case _constantsJs.LUNR_INDEX_STATE:
            next(actionWith(searchLunr));

            addToIndex(getDataFromState(options, getState), options).then(function (res) {
              x;
              dispatch({
                type: _constantsJs.LUNR_INDEX_STATE_SUCCESS,
                searchIndex: res
              });
            })['catch'](function (err) {
              throw new Error(err);
            });
            break;
          case _constantsJs.LUNR_SEARCH_START:
            next(actionWith(searchLunr));
            var results = options.store.existingStore ? retrieveResultsFromState(getState, options, doLunrSearch(getState, _query)) : retrieveResultsFromStore(getState, doLunrSearch(getState, _query));

            dispatch({
              type: _constantsJs.LUNR_SEARCH_SUCCESS,
              results: _limit ? results.slice(0, _limit) : results,
              query: _query
            });

            break;
          default:
            throw new UnreconizedActionTypeException('Unknown action, ' + type);
        }
      };
    };
  };
}