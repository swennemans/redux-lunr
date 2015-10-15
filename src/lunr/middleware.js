//var Worker = require("./worker.wrk.js");
//var worker = new Worker();

import lunr from 'lunr';

import {
    LUNR_INDEX_STATE,
    LUNR_INDEX_DOCS,
    LUNR_INDEX_DOCS_SUCCESS,
    LUNR_SEARCH_START,
    LUNR_SEARCH_SUCCESS,
    LUNR_INDEX_STATE_SUCCESS,
    LUNR_PRETTIFY_RESULTS,
    } from './constants.js';

function UnreconizedActionTypeException(message) {
  this.message = message;
  this.name = 'UnreconizedActionTypeException';
}

/* Simple function that retrieve state based on reducer
 and entity. Arguments should be passed when initing
 middleware. Usually configureStore.js
 */
function getDataFromState(options, getState) {
  const {reducer, entity} = options.store;

  console.log(getState()[reducer][entity]);

  return getState()[reducer][entity];
}

function createLunrIndex(options) {
  let index = options.index;

  return lunr(function() {
    Object.keys(index).forEach((key) => {
      if (key === 'ref') {
        console.log('key is', index[key]);
        this.ref(index[key])
      } else {
        this.field(key, index[key])
      }
    })
  });
}

/* addToIndex creates an index based on the documents passed saved in _toIndex
 * options has background var with true/false. If true, index will be created in background thread
 * default is false.
 */
function addToIndex(_toIndex, options) {
  const {background} = options;

  /* Wrap in promise because webworker returns async */
  return new Promise(
      (resolve, reject) => {
        if (!background) {
          let idx = createLunrIndex(options);
          _toIndex.forEach((doc) => {
            idx.add(doc)
          });
          resolve(idx)

        }
        else if (background) {
          worker.onmessage = (e) => {
            resolve(lunr.Index.load(JSON.parse(e.data)));
          };
          worker.postMessage(JSON.stringify({options, _toIndex}))
        } else {
          reject({err: "Redux-Lunr: unknow indexing option passed"})
        }
      })
}


/* Add documents to lunr reducer store */
function addToStore(_toIndex) {
  return _toIndex.map((doc) => {
    return doc
  });
}

function retrieveResultsFromStore(getState, results) {
  if (results.length > 0) {
    const lunrStore = getState().lunr.docs;
    return flatten(results.map((result) => {
      return lunrStore.filter((doc) => {
        return doc.id === result.ref
      })
    }));
  } else {
    return []
  }
}

function doLunrSearch(getState, _query) {
  return getState().lunr.searchIndex.search(_query)
}

function retrieveResultsFromState(getState, options, results) {
  if (results.length > 0) {
    const {reducer, entity} = options.store;
    const store = getState()[reducer][entity];

    return flatten(results.map((result) => {
      return store.filter((doc) => {
        return doc.id === result.ref
      })
    }));

  } else {
    return []
  }
}

function flatten(results) {
  return results.reduce((a, b) => {
    return a.concat(b)
  })
}

function isInt(number) {
  if (typeof number === 'string') {
   return true
  }
  else if (!isNaN(number)) {
    return number % 1 !== 0
  } else {
    return true
  }
}

function prettifyResults(_query, results) {
  var queries = _query.split(" ");
  var arr;


  const checkWord = (word) => {
    return (new RegExp(`${_query}`, 'i')).test(word)
  };

  const alterText = (query, word) => {
    var escape = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
    var tagStr = '{tag}$&{tag}';
    const markTag = '**';
    const caseSensitive = false

    return word.replace(
        RegExp(escape, caseSensitive ? 'g' : 'gi'),
        tagStr.replace(/{tag}/gi, markTag)
    );
  };

  return results.map((result) => {
    //console.log('res is', res);
    var newObj = {};
    Object.keys(result).forEach((key) => {

      if (Array.isArray(result[key])) {

        result[key].forEach((el) => {


          if (checkWord(el)) {
            console.log('key is', key);

            /* Already an array in newObject? */
            if (Array.isArray(newObj[key])) {
              const newWord = alterText(_query, el);
              newObj[key] = newWord
            } else {
              const newWord = alterText(_query, el);
              newObj[key] = newWord
            }
          }
        })
      }

      if (!Array.isArray(result[key]) && checkWord(result[key])) {
        const newString = alterText(_query, result[key])

        newObj[key] = newString
      } else {
        newObj[key] = result[key]
      }
    })

    console.log('newObject', newObj);

    return newObj

  });
}

export const SEARCH_LUNR = Symbol('Lunr Search');

export function createLunrMiddleware(options) {

  return function({dispatch, getState}) {
    return next => action => {


      const searchLunr = action[SEARCH_LUNR];
      if (typeof searchLunr === 'undefined') {
        return next(action);
      }

      const {_toIndex, _query, _limit, type, ...rest} = searchLunr;
      if (!_toIndex instanceof Array) {
        throw new Error('Redux-Lunr: passed documents must be an array of objects')
      }
      if (_query !== undefined && typeof _query !== 'string') {
        throw new Error('Redux-Lunr: search query must be a string!')
      }
      if (_limit !== undefined && isInt(_limit)) {
        throw new Error('Redux-Lunr: search limit must be an integer!')
      }

      if (options.store.existingStore && (options.store.reducer === undefined || options.store.entity === undefined)) {
        throw new Error('Redux-Lunr: if using existing Redux Store please define a reducer and an entity')
      }

      function actionWith(data) {
        const finalAction = Object.assign({}, action, data);
        delete finalAction[SEARCH_LUNR];
        return finalAction;
      }


      switch (type) {
        case  LUNR_INDEX_DOCS:
          next(actionWith(searchLunr));

          addToIndex(_toIndex, options).then((value) => {
            console.log('succes', value);
            //let docs = addToStore(value)
            dispatch({
              type: LUNR_INDEX_DOCS_SUCCESS,
              searchIndex: value,
              docs: _toIndex
            });
          }).catch((err) => {
            throw new Error(err)
          });
          break;
        case  LUNR_INDEX_STATE:
          next(actionWith(searchLunr));

          addToIndex(getDataFromState(options, getState), options)
              .then((res) => {x
                dispatch({
                  type: LUNR_INDEX_STATE_SUCCESS,
                  searchIndex: res
                });
              }).catch((err) => {
                throw new Error(err)
              });
          break;
        case LUNR_SEARCH_START:
          next(actionWith(searchLunr));
          let results = options.store.existingStore ?
              retrieveResultsFromState(getState, options, doLunrSearch(getState, _query)) :
              retrieveResultsFromStore(getState, doLunrSearch(getState, _query));

          dispatch({
            type: LUNR_SEARCH_SUCCESS,
            results: _limit ? results.slice(0, _limit) : results,
            query: _query
          });

          break;
        default:
          throw new UnreconizedActionTypeException('Unknown action, ' + type);
      }
    }
  }
}

function checkWord(query, word) {
  return (new RegExp(`${query}`, 'i')).test(word)
}

function alterText(query, word) {
  var escape = query.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  var tagStr = '{tag}$&{tag}';
  const markTag = '**';
  const caseSensitive = false

  return word.replace(
      RegExp(escape, caseSensitive ? 'g' : 'gi'),
      tagStr.replace(/{tag}/gi, markTag)
  );
}

function prepareText(word, results, standardKeys) {

  let obj = new Object()
  results.forEach((result) => {

    Object.keys(result).forEach((key) => {

      const current = result[key];

      console.log('current', current);
      /* Check for arrays. If exists, added these to new array with updated
       results. Will create a new array when needed and updates when already exists.
       */
      if (Array.isArray(current)) {
        current.forEach((el) => {
          if (checkWord(word, el)) {
            /* Already an array in newObject? */
            if (obj[key] !== undefined) {
              const newWord = alterText(word, el);
              obj[key].push(newWord)
            } else {
              const newWord = alterText(word, el);
              obj[key] = [newWord]
            }
          }
        })
      }

      /* Check values, that are not in arrays */
      if (!Array.isArray(current)) {
        if (checkWord(word, current)) {
          obj[key] = alterText(word, current)
        }

        else {
          /* Last check. Why? Because some keys (like name city) must always be added */
          standardKeys.forEach((std) => {
            if (obj[std] === undefined) {
              obj[std] = result[std]
            }
          })
        }
      }
    });
  });
  return obj
}

function mergeResults(results) {

  let newObj;
  results.forEach((result) => {
    newObj = Object.assign({}, newObj, result)
  });
  return newObj
}


export function prettyResults() {
  return function({dispatch}) {
    return next => action => {

      if (action.type !== LUNR_PRETTIFY_RESULTS) {
        return next(action)
      }


      switch (action.type) {
        case LUNR_PRETTIFY_RESULTS:
          const {query, results} = action;
          /* Defined standard keys, always added to the results, no matter
           * if it's a search query or not */
          const standardKeys = ["id"];
          let resp = query.split(" ").map((word) => {
            if (word === "") return;
            return prepareText(word, results, standardKeys);
          });



            dispatch({
              type: LUNR_PRETTIFY_RESULTS,
              prettyResults: mergeResults(resp)
            });

          break;
        default:
          throw new UnreconizedActionTypeException('Unknown action, ' + type);
      }
    }
  }
}