/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_CODE_INJECTION_FORM,
  OPEN_CODE_INJECTION_FORM,
  CLOSE_CODE_INJECTION_FORM,
} from '../../constants/actions';
import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../senders';

import { updateForm as updateFormDialogWorkspacePreferences } from '../dialog-workspace-preferences/actions';

export const open = (codeInjectionType) => (dispatch, getState) => {
  if (window.mode === 'workspace-preferences') {
    const { form } = getState().dialogWorkspacePreferences;
    dispatch({
      type: OPEN_CODE_INJECTION_FORM,
      codeInjectionType,
      form: {
        preferences: {
          code: form.preferences[`${codeInjectionType}CodeInjection`],
        },
      },
    });
    return;
  }

  const { preferences } = getState();
  dispatch({
    type: OPEN_CODE_INJECTION_FORM,
    codeInjectionType,
    form: {
      code: preferences[`${codeInjectionType}CodeInjection`],
    },
  });
};

export const close = () => ({
  type: CLOSE_CODE_INJECTION_FORM,
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_CODE_INJECTION_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form, codeInjectionType } = getState().dialogCodeInjection;

  if (window.mode === 'workspace-preferences') {
    dispatch(updateFormDialogWorkspacePreferences({
      preferences: {
        [`${codeInjectionType}CodeInjection`]: form.code,
      },
    }));
  } else {
    requestSetPreference(`${codeInjectionType}CodeInjection`, form.code);
  }

  dispatch(close());

  enqueueRequestRestartSnackbar();
};
