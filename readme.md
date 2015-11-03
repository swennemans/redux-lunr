![](https://raw.githubusercontent.com/swennemans/redux-lunr/master/assets/example.gif)

# redux-lunr

Redux middleware that makes your store searchable with Lunr.js

## Project Status
* Fairly stable but API might change a bit, making it more user friendly.
* Example:  not yet finished. Will finish when I'm back from my holiday.


## Installation

` npm install redux-lunr --save `

## Implementation

**Step 1** : add the `redux-lunr` reducer to Redux.
```js
import { combineReducers } from 'redux'
import { lunrReducer } from 'redux-lunr'
...
const rootReducer = combineReducers({
    //other reducers here
    lunr: lunrReducer
})
```
**Step 2** : Define options.
```js
const lunrOptions = {
  index: {
    ref: 'id',
    name: { boost: 15 },
    bio: { boost: 5 }
  },
  mapper: (doc) => {
    return {
      id: doc.id,
      name: doc.profile.name,
      bio: doc.profile.bio
    }
  },
  store: {
    existingStore: true,
    reducer: 'users',
    entity: 'profiles'
  }
}
```

* `index`: consists of your [Lunr index](http://lunrjs.com/);
* `mapper` : optional mapper function that you can define if you want to index nested properties.
* `store` : If you want to index an existing store, pass the information here. Define the `reducer` and the `entities`.

For example, a `users` reducer that would match the above options:
```
function users(state = {
    //other properties here
    profiles: [
        {id: 1, profile: { name: 'Foo', bio: 'Awesome life story' }},
        {id: 2, profile: { name: 'Bar', bio: 'An even better life story' }}
    ]
}, actions) {
    switch (action.type) {
        //etc
    }
}
```

**Step 3** : add the `redux-lunr` middleware to Redux.


```js
import { createStore, applyMiddleware, compose } from 'redux'
import { createLunrMiddleware } from 'redux-lunr'
import thunkMiddleware from 'redux-thunk'

const finalCreateStore = compose(
    applyMiddleware(createLogger(),createLunrMiddleware(lunrOptions))
)(createStore);
```

## usage

`Redux-lunr`'s API has  a number of actions you can utilize.

#### `loadDocsIntoIndex(documents: Array)`
```js
import { loadDocsIntoIndex } from 'redux-lunr'
dispatch(loadDocsIntoIndex([{}, {}, {}])
```

Pass an array of objects to index and thus make it searchable.

#### `loadStateIntoIndex()`
```js
import { loadStateIntoIndex } from 'redux-lunr'
dispatch(loadStateIntoIndex())
```
When you want to search an existing store (defined in the options object), call `loadStateIntoIndex()`
to actually index this store.

#### `loadPreparedIndexIntoIndex(preparedSearchIndex)`
```js
import { loadPreparedIndexIntoIndex } from 'redux-lunr'
dispatch(loadPreparedIndexIntoIndex(serializedLunrIndex))
```

If you want to index a huge number of documents, it's probably smarter to do this indexing on your server.  Serialize this index and load the index on the client. See https://github.com/olivernn/lunr.js/issues/60

You can pass the serialized index to fhis function.


#### `lunrStartSearch(query: String, limit: Int)`
Do your searching here.
The results will be saved in in the `lunr Reducer` under the property `results`

```js
import { lunrStartSearch } from 'redux-lunr'
dispatch(lunrStartSearch('foo', 10))
```


#### `lunrResetSearchResults()`

```js
import { lunrResetSearchResults } from 'redux-lunr'
dispatch(lunrResetSearchResults())
```

Reset the search results. Resets the property results in the `lunr Reducer`


## TODO
* Add pipeline functions
* Add example


