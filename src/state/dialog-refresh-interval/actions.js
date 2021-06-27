/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_REFRESH_INTERVAL_FORM,
  OPEN_REFRESH_INTERVAL_FORM,
  CLOSE_REFRESH_INTERVAL_FORM,
} from '../../constants/actions';
import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
  requestRequestReloadWorkspaceDialog,
} from '../../senders';
import roundTime from '../../helpers/round-time';
import getStaticGlobal from '../../helpers/get-static-global';

import { updateForm as updateFormDialogWorkspacePreferences } from '../dialog-workspace-preferences/actions';

export const open = () => (dispatch, getState) => {
  const state = getState();
  let autoRefreshInterval = 0;

  if (window.mode === 'workspace-preferences') {
    autoRefreshInterval = state.dialogWorkspacePreferences.form.autoRefreshInterval
      || state.preferences.autoRefreshInterval;
  } else {
    autoRefreshInterval = state.preferences.autoRefreshInterval;
  }

  const time = roundTime(autoRefreshInterval);

  dispatch({
    type: OPEN_REFRESH_INTERVAL_FORM,
    form: {
      value: time.value,
      unit: time.unit,
    },
  });
};

export const close = () => ({
  type: CLOSE_REFRESH_INTERVAL_FORM,
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_REFRESH_INTERVAL_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form: { value, unit } } = getState().dialogRefreshInterval;

  const secondInMilliseconds = 1000;
  const minuteInMilliseconds = 60 * secondInMilliseconds;
  const hourInMilliseconds = 60 * minuteInMilliseconds;

  let autoRefreshInterval = value;
  if (unit === 'hours') autoRefreshInterval = value * hourInMilliseconds;
  else if (unit === 'minutes') autoRefreshInterval = value * minuteInMilliseconds;
  else if (unit === 'seconds') autoRefreshInterval = value * secondInMilliseconds;

  if (window.mode === 'workspace-preferences') {
    dispatch(updateFormDialogWorkspacePreferences({
      preferences: {
        autoRefreshInterval,
      },
    }));
    const workspaceId = getStaticGlobal('workspacePreferencesWorkspaceId');
    requestRequestReloadWorkspaceDialog(workspaceId);
  } else {
    requestSetPreference('autoRefreshInterval', autoRefreshInterval);
    enqueueRequestRestartSnackbar();
  }

  dispatch(close());
};
