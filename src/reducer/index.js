import { combineReducers } from 'redux';
import profiles from './profiles';
import lunr from '../lunr/reducer.js';

const rootReducer = combineReducers({
  profiles,
  lunr
});

export default rootReducer