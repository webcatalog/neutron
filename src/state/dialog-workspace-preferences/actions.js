/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_WORKSPACE_PREFERENCES_DIALOG,
} from '../../constants/actions';

import {
  requestSetWorkspace,
  requestReloadViewDarkReader,
} from '../../senders';

import getStaticGlobal from '../../helpers/get-static-global';

export const updateForm = (changes) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WORKSPACE_PREFERENCES_DIALOG,
    changes,
  });

  const workspaceId = getStaticGlobal('workspacePreferencesWorkspaceId');
  const { preferences, disableAudio } = getState().dialogWorkspacePreferences.form;

  requestSetWorkspace(workspaceId, {
    disableAudio: disableAudio === true ? true : undefined,
    preferences,
  });

  const shouldReloadDarkReader = Object.keys(changes).find((key) => key.startsWith('darkReader'));
  if (shouldReloadDarkReader) {
    requestReloadViewDarkReader(workspaceId);
  }
};
