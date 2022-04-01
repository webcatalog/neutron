/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_DIALOG_EXTERNAL_URLS,
  OPEN_DIALOG_EXTERNAL_URLS,
  CLOSE_DIALOG_EXTERNAL_URLS,
} from '../../constants/actions';
import {
  requestSetPreference,
} from '../../senders';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import { updateForm as updateFormDialogWorkspacePreferences } from '../dialog-workspace-preferences/actions';

export const open = () => (dispatch, getState) => {
  if (window.mode === 'workspace-preferences') {
    const { form } = getState().dialogWorkspacePreferences;
    dispatch({
      type: OPEN_DIALOG_EXTERNAL_URLS,
      form: { externalUrlRule: form.preferences.externalUrlRule },
    });
    return;
  }

  const { preferences } = getState();
  dispatch({
    type: OPEN_DIALOG_EXTERNAL_URLS,
    form: { externalUrlRule: preferences.externalUrlRule },
  });
};

export const close = () => ({
  type: CLOSE_DIALOG_EXTERNAL_URLS,
});

const getValidationRules = () => ({
  externalUrlRule: {
    fieldName: 'External URL Rule',
    regExp: true,
  },
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_DIALOG_EXTERNAL_URLS,
  changes: validate(changes, getValidationRules()),
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogExternalUrls;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  if (window.mode === 'workspace-preferences') {
    dispatch(updateFormDialogWorkspacePreferences({
      preferences: {
        externalUrlRule: form.externalUrlRule,
      },
    }));
  } else {
    requestSetPreference('externalUrlRule', form.externalUrlRule);
  }

  dispatch(close());
};
