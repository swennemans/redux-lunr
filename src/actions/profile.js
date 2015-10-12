import {LOAD_PROFILES} from '../constants/ActionTypes';

export const loadProfiles = () => {
  return {
    type: LOAD_PROFILES,
    profiles: [
      {
        id: '1',
        name: "Sven",
        bio: "Some dude living in Amsterdam"
      },
      {
        id: '2',
        name: "Pieter",
        bio: "Some dude living in Utje"
      },
      {
        id: '3',
        name: "Lisa",
        bio: "Sven's girlfriend"
      },
      {
        id: '4',
        name: "Urf",
        bio: "Lisa's father"
      }
    ]
  }
}