import {
  UPDATE_CUSTOM_USER_AGENT_FORM,
  OPEN_CUSTOM_USER_AGENT_FORM,
  CLOSE_CUSTOM_USER_AGENT_FORM,
} from '../../constants/actions';
import {
  requestSetPreference,
} from '../../senders';

import { updateForm as updateFormDialogWorkspacePreferences } from '../dialog-workspace-preferences/actions';

export const open = () => (dispatch, getState) => {
  if (window.mode === 'workspace-preferences') {
    const { form } = getState().dialogWorkspacePreferences;
    dispatch({
      type: OPEN_CUSTOM_USER_AGENT_FORM,
      form: { code: form.customUserAgent },
    });
    return;
  }

  const { preferences } = getState();
  dispatch({
    type: OPEN_CUSTOM_USER_AGENT_FORM,
    form: { code: preferences.customUserAgent },
  });
};

export const close = () => ({
  type: CLOSE_CUSTOM_USER_AGENT_FORM,
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_CUSTOM_USER_AGENT_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogCustomUserAgent;

  if (window.mode === 'workspace-preferences') {
    dispatch(updateFormDialogWorkspacePreferences({
      customUserAgent: form.code,
    }));
  } else {
    requestSetPreference('customUserAgent', form.code);
  }

  dispatch(close());
};
