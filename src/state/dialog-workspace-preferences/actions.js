import {
  UPDATE_WORKSPACE_PREFERENCES_DIALOG,
} from '../../constants/actions';

import {
  requestSetWorkspace,
  requestReloadViewDarkReader,
} from '../../senders';

export const updateForm = (changes) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WORKSPACE_PREFERENCES_DIALOG,
    changes,
  });

  const workspaceId = window.remote.getGlobal('workspacePreferencesWorkspaceId');
  const preferences = getState().dialogWorkspacePreferences.form;
  requestSetWorkspace(workspaceId, { preferences });

  const shouldReloadDarkReader = Object.keys(changes).find((key) => key.startsWith('darkReader'));
  if (shouldReloadDarkReader) {
    requestReloadViewDarkReader(workspaceId);
  }
};
