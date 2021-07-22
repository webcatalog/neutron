/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_CUSTOM_USER_AGENT_FORM,
  OPEN_CUSTOM_USER_AGENT_FORM,
  CLOSE_CUSTOM_USER_AGENT_FORM,
} from '../../constants/actions';
import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../senders';

import { updateForm as updateFormDialogWorkspacePreferences } from '../dialog-workspace-preferences/actions';

export const open = () => (dispatch, getState) => {
  if (window.mode === 'workspace-preferences') {
    const { form } = getState().dialogWorkspacePreferences;
    dispatch({
      type: OPEN_CUSTOM_USER_AGENT_FORM,
      form: { customUserAgent: form.preferences.customUserAgent },
    });
    return;
  }

  const { preferences } = getState();
  dispatch({
    type: OPEN_CUSTOM_USER_AGENT_FORM,
    form: { customUserAgent: preferences.customUserAgent },
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
      preferences: {
        customUserAgent: form.customUserAgent,
      },
    }));
  } else {
    requestSetPreference('customUserAgent', form.customUserAgent);
  }

  dispatch(close());

  enqueueRequestRestartSnackbar();
};
