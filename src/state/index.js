/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import thunkMiddleware from 'redux-thunk';

import appLock from './appLock/reducers';
import dialogAddWorkspace from './dialogAddWorkspace/reducers';
import dialogAppLock from './dialogAppLock/reducers';
import dialogAuth from './dialogAuth/reducers';
import dialogCodeInjection from './dialogCodeInjection/reducers';
import dialogCustomUserAgent from './dialogCustomUserAgent/reducers';
import dialogCustomizeFonts from './dialogCustomizeFonts/reducers';
import dialogEditWorkspace from './dialogEditWorkspace/reducers';
import dialogExternalUrls from './dialogExternalUrls/reducers';
import dialogGoToUrl from './dialogGoToUrl/reducers';
import dialogInternalUrls from './dialogInternalUrls/reducers';
import dialogLicenseRegistration from './dialogLicenseRegistration/reducers';
import dialogProxy from './dialogProxy/reducers';
import dialogRefreshInterval from './dialogRefreshInterval/reducers';
import dialogSpellcheckLanguages from './dialogSpellcheckLanguages/reducers';
import dialogWorkspacePreferences from './dialogWorkspacePreferences/reducers';
import findInPage from './findInPage/reducers';
import general from './general/reducers';
import notifications from './notifications/reducers';
import preferences from './preferences/reducers';
import systemPreferences from './systemPreferences/reducers';
import updater from './updater/reducers';
import workspaceMetas from './workspaceMetas/reducers';
import workspaces from './workspaces/reducers';

import loadListeners from '../listeners';

const rootReducer = combineReducers({
  appLock,
  dialogAddWorkspace,
  dialogAppLock,
  dialogAuth,
  dialogCodeInjection,
  dialogCustomUserAgent,
  dialogCustomizeFonts,
  dialogEditWorkspace,
  dialogExternalUrls,
  dialogGoToUrl,
  dialogInternalUrls,
  dialogLicenseRegistration,
  dialogProxy,
  dialogRefreshInterval,
  dialogSpellcheckLanguages,
  dialogWorkspacePreferences,
  findInPage,
  general,
  notifications,
  preferences,
  systemPreferences,
  updater,
  workspaceMetas,
  workspaces,
});

const configureStore = (initialState) => {
  const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunkMiddleware),
  );

  loadListeners(store);

  return store;
};

export default configureStore;
