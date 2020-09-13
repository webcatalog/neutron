import { combineReducers } from 'redux';

import {
  DIALOG_SPELLCHECK_LANGUAGES_UPDATE_FORM,
  DIALOG_SPELLCHECK_LANGUAGES_OPEN,
  DIALOG_SPELLCHECK_LANGUAGES_CLOSE,
} from '../../constants/actions';

const form = (state = {}, action) => {
  switch (action.type) {
    case DIALOG_SPELLCHECK_LANGUAGES_OPEN: return action.form;
    case DIALOG_SPELLCHECK_LANGUAGES_UPDATE_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_SPELLCHECK_LANGUAGES_OPEN: return true;
    case DIALOG_SPELLCHECK_LANGUAGES_CLOSE: return false;
    default: return state;
  }
};

export default combineReducers({ open, form });
