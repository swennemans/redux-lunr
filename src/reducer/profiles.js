import {LOAD_PROFILES} from '../constants/ActionTypes';

export default function profile(state = {
  profiles: []
}, action) {
  switch (action.type) {
    case LOAD_PROFILES:
      return Object.assign({}, state, {
        profiles: action.profiles
      });
    default:
      return state;
  }
}
