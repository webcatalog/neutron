/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  OPEN_DIALOG_INTERNAL_URLS,
  CLOSE_DIALOG_INTERNAL_URLS,
} from '../../constants/actions';

export const open = () => (dispatch, getState) => {
  if (window.mode === 'workspace-preferences') {
    const { form } = getState().dialogWorkspacePreferences;
    dispatch({
      type: OPEN_DIALOG_INTERNAL_URLS,
      form: { internalUrlRule: form.internalUrlRule },
    });
    return;
  }

  const { preferences } = getState();
  dispatch({
    type: OPEN_DIALOG_INTERNAL_URLS,
    form: { internalUrlRule: preferences.internalUrlRule },
  });
};

export const close = () => ({
  type: CLOSE_DIALOG_INTERNAL_URLS,
});
