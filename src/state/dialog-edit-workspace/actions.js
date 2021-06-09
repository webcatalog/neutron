/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  OPEN_EDIT_WORKSPACE,
  CLOSE_EDIT_WORKSPACE,
  UPDATE_EDIT_WORKSPACE_FORM,
} from '../../constants/actions';

import hasErrors from '../../helpers/has-errors';
import isUrl from '../../helpers/is-url';
import validate from '../../helpers/validate';
import getStaticGlobal from '../../helpers/get-static-global';

import { updateForm as updateWorkspacePreferencesForm } from '../dialog-workspace-preferences/actions';

export const open = () => (dispatch, getState) => {
  const {
    dialogWorkspacePreferences: {
      form: {
        name,
        homeUrl,
      },
    },
  } = getState();

  dispatch({
    type: OPEN_EDIT_WORKSPACE,
    form: {
      name,
      homeUrl,
    },
  });
};

export const close = () => ({
  type: CLOSE_EDIT_WORKSPACE,
});

const getValidationRules = () => ({
  homeUrl: {
    fieldName: 'Home URL',
    required: !getStaticGlobal('appJson').url,
    lessStrictUrl: true,
  },
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_EDIT_WORKSPACE_FORM,
  changes: validate(changes, getValidationRules()),
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogEditWorkspace;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  const homeUrl = (() => {
    if (form.homeUrl) {
      const url = form.homeUrl.trim();
      return isUrl(url) ? url : `http://${url}`;
    }
    return null;
  })();

  dispatch(updateWorkspacePreferencesForm({
    name: form.name,
    homeUrl,
  }));

  dispatch(close());
};
