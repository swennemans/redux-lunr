import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLunrMiddleware from '../lunr/middleware'
import reducer from '../reducer';
import lunr from 'lunr';
import createLogger from 'redux-logger';
const logger = createLogger();

//const idx = lunr(function() {
//  this.field('name');
//  this.field('bio');
//  this.field('interesses');
//  this.field('city');
//  this.field('type');
//});



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
  background: true
};

const createStoreWithMiddleware = applyMiddleware(
    thunk,
    createLunrMiddleware(options),
    logger
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
