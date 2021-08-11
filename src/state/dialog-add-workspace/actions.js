/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  ADD_WORKSPACE_RESET_FORM,
  ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
  ADD_WORKSPACE_UPDATE_FORM,
  ADD_WORKSPACE_UPDATE_MODE,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import isUrl from '../../helpers/is-url';
import hasErrors from '../../helpers/has-errors';

import { requestCreateWorkspace } from '../../senders';

import appSearch from '../../app-search';

const getValidationRules = () => ({
  name: {
    fieldName: 'Name',
    required: true,
  },
  homeUrl: {
    fieldName: 'Home URL',
    required: true,
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
  const { form: { name, homeUrl, homeUrlError } } = getState().dialogAddWorkspace;
  if (!homeUrl || homeUrlError) return;

  dispatch({
    type: ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
    downloadingIcon: true,
  });

  getWebsiteIconUrlAsync(homeUrl, name)
    .then((iconUrl) => {
      const { form } = getState().dialogAddWorkspace;
      if (form.homeUrl === homeUrl) {
        const changes = { internetIcon: iconUrl || form.internetIcon };
        dispatch(({
          type: ADD_WORKSPACE_UPDATE_FORM,
          changes,
        }));
        dispatch({
          type: ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
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
  const { form: { name, homeUrl, homeUrlError } } = getState().dialogAddWorkspace;
  if (!homeUrl || homeUrlError) return;

  dispatch({
    type: ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
    downloadingIcon: true,
  });

  getWebsiteIconUrlFromSwifttypeAsync(homeUrl, name)
    .then((iconUrl) => {
      const { form } = getState().dialogAddWorkspace;
      if (form.homeUrl === homeUrl) {
        const changes = { internetIcon: iconUrl || form.internetIcon };
        dispatch(({
          type: ADD_WORKSPACE_UPDATE_FORM,
          changes,
        }));
        dispatch({
          type: ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
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

export const updateForm = (changes) => ({
  type: ADD_WORKSPACE_UPDATE_FORM,
  changes: validate(changes, getValidationRules()),
});

export const resetForm = () => ({
  type: ADD_WORKSPACE_RESET_FORM,
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogAddWorkspace;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const url = form.homeUrl.trim();
  const homeUrl = isUrl(url) ? url : `http://${url}`;

  requestCreateWorkspace({
    name: form.name,
    homeUrl,
    picture: form.internetIcon || form.imgPath,
    transparentBackground: Boolean(form.transparentBackground),
    preferredIconType: form.preferredIconType,
    preferences: {
      color: form.color,
    },
  });

  window.remote.getCurrentWindow().close();

  dispatch(resetForm());
  return null;
};

export const updateMode = (mode) => ({
  type: ADD_WORKSPACE_UPDATE_MODE,
  mode,
});
