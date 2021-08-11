/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_WORKSPACE_PREFERENCES_FORM,
  UPDATE_WORKSPACE_PREFERENCES_DOWNLOADING_ICON,
} from '../../constants/actions';

import {
  requestSetWorkspace,
  requestReloadViewDarkReader,
  requestSetWorkspacePicture,
  requestRemoveWorkspacePicture,
} from '../../senders';

import getStaticGlobal from '../../helpers/get-static-global';

import appSearch from '../../app-search';

export const updateForm = (changes) => (dispatch, getState) => {
  dispatch({
    type: UPDATE_WORKSPACE_PREFERENCES_FORM,
    changes,
  });

  const workspaceId = getStaticGlobal('workspacePreferencesWorkspaceId');
  const {
    name,
    homeUrl,
    disableAudio,
    disableNotifications,
    transparentBackground,
    preferredIconType,
    imgPath,
    preferences,
  } = getState().dialogWorkspacePreferences.form;

  requestSetWorkspace(workspaceId, {
    name,
    homeUrl,
    disableAudio: Boolean(disableAudio),
    disableNotifications: Boolean(disableNotifications),
    transparentBackground: Boolean(transparentBackground),
    preferredIconType,
    preferences,
  });

  if (imgPath) {
    requestSetWorkspacePicture(workspaceId, imgPath);
  } else {
    requestRemoveWorkspacePicture(workspaceId);
  }

  const shouldReloadDarkReader = Object.keys(changes).find((key) => key.startsWith('darkReader'));
  if (shouldReloadDarkReader) {
    requestReloadViewDarkReader(workspaceId);
  }
};

// to be replaced with invoke (electron 7+)
// https://electronjs.org/docs/api/ipc-renderer#ipcrendererinvokechannel-args
export const getWebsiteIconUrlAsync = (url) => new Promise((resolve, reject) => {
  try {
    const id = Date.now().toString();
    window.ipcRenderer.once(id, (e, uurl) => {
      resolve(uurl);
    });
    window.ipcRenderer.send('request-get-website-icon-url', id, url);
  } catch (err) {
    reject(err);
  }
});

export const getWebsiteIconUrlFromSwifttypeAsync = (url, name) => {
  // if it fails, try to get icon from in-house database
  const query = name && name.length > 0 ? `${url} ${name}` : url;
  return appSearch
    .search(query, {
      search_fields: {
        name: {},
        url: { weight: 5 },
      },
      result_fields: {
        icon_filled: { raw: {} },
      },
      page: { size: 1 },
    })
    .then((res) => {
      if (res.rawResults.length < 1) return null;
      const app = res.rawResults[0];
      return app.icon_filled.raw;
    })
    .catch(() => null);
};

export const getIconFromInternet = () => (dispatch, getState) => {
  const { form: { homeUrl, homeUrlError } } = getState().dialogWorkspacePreferences;
  if (homeUrlError) return;

  dispatch({
    type: UPDATE_WORKSPACE_PREFERENCES_DOWNLOADING_ICON,
    downloadingIcon: true,
  });

  getWebsiteIconUrlAsync(homeUrl || getStaticGlobal('appJson').url)
    .then((iconUrl) => {
      const { form } = getState().dialogWorkspacePreferences;
      if (form.homeUrl === homeUrl) {
        const changes = {
          preferredIconType: 'image',
          imgPath: iconUrl || form.imgPath,
        };
        dispatch(updateForm(changes));
        dispatch({
          type: UPDATE_WORKSPACE_PREFERENCES_DOWNLOADING_ICON,
          downloadingIcon: false,
        });
      }

      if (!iconUrl) {
        return window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
          message: 'Unable to find a suitable icon from the URL.',
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      }

      return null;
    }).catch(console.log); // eslint-disable-line no-console
};

export const getIconFromAppSearch = () => (dispatch, getState) => {
  const { form: { name, homeUrl, homeUrlError } } = getState().dialogWorkspacePreferences;
  if (homeUrlError) return;

  dispatch({
    type: UPDATE_WORKSPACE_PREFERENCES_DOWNLOADING_ICON,
    downloadingIcon: true,
  });

  getWebsiteIconUrlFromSwifttypeAsync(homeUrl || getStaticGlobal('appJson').url, name)
    .then((iconUrl) => {
      const { form } = getState().dialogWorkspacePreferences;
      if (form.homeUrl === homeUrl) {
        const changes = {
          preferredIconType: 'image',
          imgPath: iconUrl || form.imgPath,
        };
        dispatch(updateForm(changes));
        dispatch({
          type: UPDATE_WORKSPACE_PREFERENCES_DOWNLOADING_ICON,
          downloadingIcon: false,
        });
      }

      if (!iconUrl) {
        return window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
          message: 'Unable to find a suitable icon from WebCatalog\'s database.',
          buttons: ['OK'],
          cancelId: 0,
          defaultId: 0,
        });
      }

      return null;
    }).catch(console.log); // eslint-disable-line no-console
};
