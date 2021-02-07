/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_EDIT_WORKSPACE_FORM,
  UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON,
} from '../../constants/actions';

import hasErrors from '../../helpers/has-errors';
import isUrl from '../../helpers/is-url';
import validate from '../../helpers/validate';
import getStaticGlobal from '../../helpers/get-static-global';

import {
  requestSetWorkspace,
  requestSetWorkspacePicture,
  requestRemoveWorkspacePicture,
} from '../../senders';

import swiftype from '../../swiftype';

const getValidationRules = () => ({
  homeUrl: {
    fieldName: 'Home URL',
    required: !getStaticGlobal('appJson').url,
    lessStrictUrl: true,
  },
});

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
  return swiftype
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
  const { form: { homeUrl, homeUrlError } } = getState().dialogEditWorkspace;
  if (homeUrlError) return;

  dispatch({
    type: UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON,
    downloadingIcon: true,
  });

  getWebsiteIconUrlAsync(homeUrl || appJson.url)
    .then((iconUrl) => {
      const { form } = getState().dialogEditWorkspace;
      if (form.homeUrl === homeUrl) {
        const changes = {
          preferredIconType: 'image',
          internetIcon: iconUrl || form.internetIcon,
        };
        dispatch(({
          type: UPDATE_EDIT_WORKSPACE_FORM,
          changes,
        }));
        dispatch({
          type: UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON,
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

export const getIconFromSwiftype = () => (dispatch, getState) => {
  const { form: { name, homeUrl, homeUrlError } } = getState().dialogEditWorkspace;
  if (homeUrlError) return;

  dispatch({
    type: UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON,
    downloadingIcon: true,
  });

  getWebsiteIconUrlFromSwifttypeAsync(homeUrl || appJson.url, name)
    .then((iconUrl) => {
      const { form } = getState().dialogEditWorkspace;
      if (form.homeUrl === homeUrl) {
        const changes = {
          preferredIconType: 'image',
          internetIcon: iconUrl || form.internetIcon,
        };
        dispatch(({
          type: UPDATE_EDIT_WORKSPACE_FORM,
          changes,
        }));
        dispatch({
          type: UPDATE_EDIT_WORKSPACE_DOWNLOADING_ICON,
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

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_EDIT_WORKSPACE_FORM,
  changes: validate(changes, getValidationRules()),
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogEditWorkspace;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const id = window.remote.getGlobal('editWorkspaceId');
  const homeUrl = (() => {
    if (form.homeUrl) {
      const url = form.homeUrl.trim();
      return isUrl(url) ? url : `http://${url}`;
    }
    return null;
  })();

  requestSetWorkspace(
    id,
    {
      name: form.name,
      homeUrl,
      // prefs
      disableAudio: Boolean(form.disableAudio),
      disableNotifications: Boolean(form.disableNotifications),
      hibernateWhenUnused: Boolean(form.hibernateWhenUnused),
      transparentBackground: Boolean(form.transparentBackground),
      preferredIconType: form.preferredIconType,
      backgroundColor: form.backgroundColor,
    },
  );

  if (form.picturePath) {
    requestSetWorkspacePicture(id, form.picturePath);
  } else if (form.internetIcon) {
    requestSetWorkspacePicture(id, form.internetIcon);
  } else {
    requestRemoveWorkspacePicture(id);
  }

  window.remote.getCurrentWindow().close();
  return null;
};
