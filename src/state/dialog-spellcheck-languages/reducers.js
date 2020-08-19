import { combineReducers } from 'redux';

import {
  DIALOG_SPELLCHECK_LANGUAGES_UPDATE_FORM,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_SPELLCHECK_LANGUAGES_UPDATE_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

export default combineReducers({ form });
