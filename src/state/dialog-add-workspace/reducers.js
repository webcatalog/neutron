import { combineReducers } from 'redux';

import {
  ADD_WORKSPACE_RESET_FORM,
  ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
  ADD_WORKSPACE_UPDATE_FORM,
  ADD_WORKSPACE_UPDATE_MODE,
} from '../../constants/actions';

const defaultForm = {
  name: '',
  homeUrl: '',
  picturePath: null,
};
const form = (state = defaultForm, action) => {
  switch (action.type) {
    case ADD_WORKSPACE_RESET_FORM: return defaultForm;
    case ADD_WORKSPACE_UPDATE_FORM: return { ...state, ...action.changes };
    default: return state;
  }
};

const defaultMode = 'catalog';
const mode = (state = defaultMode, action) => {
  switch (action.type) {
    case ADD_WORKSPACE_UPDATE_MODE: return action.mode;
    default: return state;
  }
};

const downloadingIcon = (state = false, action) => {
  switch (action.type) {
    case ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON: return action.downloadingIcon;
    default: return state;
  }
};

export default combineReducers({
  downloadingIcon,
  form,
  mode,
});
