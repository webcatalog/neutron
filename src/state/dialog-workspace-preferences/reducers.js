import cleanDeep from 'clean-deep';

import { combineReducers } from 'redux';

import {
  UPDATE_WORKSPACE_PREFERENCES_DIALOG,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_WORKSPACE_PREFERENCES_DIALOG: return cleanDeep({ ...state, ...action.changes });
    default: return state;
  }
};

export default combineReducers({ form });
