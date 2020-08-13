import algoliasearch from 'algoliasearch';

import {
  ADD_WORKSPACE_GET_FAILED,
  ADD_WORKSPACE_GET_REQUEST,
  ADD_WORKSPACE_GET_SUCCESS,
  ADD_WORKSPACE_UPDATE_SCROLL_OFFSET,
  ADD_WORKSPACE_UPDATE_CURRENT_QUERY,
  ADD_WORKSPACE_UPDATE_DOWNLOADING_ICON,
  ADD_WORKSPACE_UPDATE_FORM,
  ADD_WORKSPACE_UPDATE_MODE,
  ADD_WORKSPACE_UPDATE_QUERY,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import isUrl from '../../helpers/is-url';
import hasErrors from '../../helpers/has-errors';

import { requestCreateWorkspace } from '../../senders';

const client = algoliasearch('4TX8Z3FKMI', '57f6e815e97deb2cdf74f49c852bc232');
const index = client.initIndex('apps');

export const getHits = () => (dispatch, getState) => {
  const state = getState();

  const {
    isGetting,
    page,
    currentQuery,
    totalPage,
  } = state.dialogAddWorkspace;

  if (isGetting) return;

  // If all pages have already been fetched, we stop
  if (totalPage && page + 1 >= totalPage) return;

  dispatch({
    type: ADD_WORKSPACE_GET_REQUEST,
  });

  index.search(currentQuery, {
    page: page + 1,
    hitsPerPage: 12,
  })
    .then((res) => {
      // validate to make sure this request is not from older query
      const currentHome = getState().dialogAddWorkspace;
      if (currentQuery !== currentHome.currentQuery || page !== currentHome.page) {
        return;
      }
      dispatch({
        type: ADD_WORKSPACE_GET_SUCCESS,
        hits: res.hits,
        page: res.page,
        totalPage: res.nbPages,
      });
    })
    .catch(() => {
      // validate to make sure this request is not from older query
      const currentHome = getState().dialogAddWorkspace;
      if (currentQuery !== currentHome.currentQuery || page !== currentHome.page) {
        return;
      }
      dispatch({
        type: ADD_WORKSPACE_GET_FAILED,
      });
    });
};

export const resetThenGetHits = () => (dispatch, getState) => {
  const state = getState();
  const { query } = state.dialogAddWorkspace;

  dispatch({
    type: ADD_WORKSPACE_UPDATE_CURRENT_QUERY,
    currentQuery: query,
  });
  dispatch(getHits());
};

let timeout;
export const updateQuery = (query, immediate = false) => (dispatch) => {
  dispatch({
    type: ADD_WORKSPACE_UPDATE_QUERY,
    query,
  });
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    dispatch(resetThenGetHits());
  }, immediate ? 0 : 500);
};

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
  window.remote.getCurrentWindow().close();
  return null;
};

export const updateMode = (mode) => ({
  type: ADD_WORKSPACE_UPDATE_MODE,
  mode,
});

export const updateScrollOffset = (scrollOffset) => ({
  type: ADD_WORKSPACE_UPDATE_SCROLL_OFFSET,
  scrollOffset,
});
