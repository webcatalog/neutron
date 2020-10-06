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

export const getIconFromInternet = () => (dispatch, getState) => {
  const { form: { homeUrl, homeUrlError } } = getState().dialogAddWorkspace;
  if (!homeUrl || homeUrlError) return;

  dispatch({
    type: ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
    downloadingIcon: true,
  });

  getWebsiteIconUrlAsync(homeUrl)
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
          message: 'Unable to find a suitable icon from the Internet.',
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

  requestCreateWorkspace(
    form.name,
    homeUrl,
    form.internetIcon || form.picturePath,
    Boolean(form.transparentBackground),
  );

  // don't close window, only hide it
  // 1. it's faster for users (normally people add multiple workspaces at once to set up)
  // 2. it gives Amplitude time to run
  window.remote.getCurrentWindow().hide();
  dispatch(resetForm());
  return null;
};

export const updateMode = (mode) => ({
  type: ADD_WORKSPACE_UPDATE_MODE,
  mode,
});
