/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import 'fontsource-roboto/400.css';
import 'fontsource-roboto/500.css';

import './amplitude';

import configureStore from './state';

import AppWrapper from './components/app-wrapper';

import getWorkspacesAsList from './helpers/get-workspaces-as-list';

import { getReactInitialStateAsync } from './invokers';

import appJson from './constants/app-json';

const DialogAbout = React.lazy(() => import('./components/dialog-about'));
const DialogAddWorkspace = React.lazy(() => import('./components/dialog-add-workspace'));
const DialogAuth = React.lazy(() => import('./components/dialog-auth'));
const DialogDisplayMedia = React.lazy(() => import('./components/dialog-display-media'));
const DialogEditWorkspace = React.lazy(() => import('./components/dialog-edit-workspace'));
const DialogGoToUrl = React.lazy(() => import('./components/dialog-go-to-url'));
const DialogNotifications = React.lazy(() => import('./components/dialog-notifications'));
const DialogOpenUrlWith = React.lazy(() => import('./components/dialog-open-url-with'));
const DialogPreferences = React.lazy(() => import('./components/dialog-preferences'));
const DialogWorkspacePreferences = React.lazy(() => import('./components/dialog-workspace-preferences'));
const Main = React.lazy(() => import('./components/main'));

const App = () => {
  switch (window.mode) {
    case 'about': return <DialogAbout />;
    case 'add-workspace': return <DialogAddWorkspace />;
    case 'auth': return <DialogAuth />;
    case 'display-media': return <DialogDisplayMedia />;
    case 'edit-workspace': return <DialogEditWorkspace />;
    case 'go-to-url': return <DialogGoToUrl />;
    case 'notifications': return <DialogNotifications />;
    case 'open-url-with': return <DialogOpenUrlWith />;
    case 'preferences': return <DialogPreferences />;
    case 'workspace-preferences': return <DialogWorkspacePreferences />;
    default: return <Main />;
  }
};

const getWorkspaceName = (workspace) => {
  let workspaceName = `Workspace ${workspace.order + 1}`;
  if (workspace.name) workspaceName = workspace.name;
  else if (workspace.accountInfo) {
    if (workspace.accountInfo.name && workspace.accountInfo.email) {
      workspaceName = `${workspace.accountInfo.name} (${workspace.accountInfo.email})`;
    } else if (workspace.accountInfo.name) {
      workspaceName = workspace.accountInfo.name;
    }
  }
  return workspaceName;
};

const runApp = () => {
  Promise.resolve()
    .then(async () => {
      const initialState = await getReactInitialStateAsync();

      if (window.mode === 'about') {
        document.title = 'About';
      } else if (window.mode === 'auth') {
        document.title = 'Sign In';
      } else if (window.mode === 'preferences') {
        document.title = 'Preferences';
      } else if (window.mode === 'workspace-preferences') {
        const workspaceId = window.remote.getGlobal('workspacePreferencesWorkspaceId');
        const workspaceList = getWorkspacesAsList(initialState.workspaces);
        const workspace = initialState.workspaces[workspaceId];
        workspaceList.some((item, index) => {
          if (item.id === workspaceId) {
            workspace.order = index;
            return true;
          }
          return false;
        });
        initialState.dialogWorkspacePreferences = { form: workspace.preferences || {} };

        document.title = `Configure Workspace "${getWorkspaceName(workspace)}"`;
      } else if (window.mode === 'edit-workspace') {
        const editWorkspaceId = window.remote.getGlobal('editWorkspaceId');
        const workspaceList = getWorkspacesAsList(initialState.workspaces);
        const workspace = initialState.workspaces[editWorkspaceId];
        workspaceList.some((item, index) => {
          if (item.id === editWorkspaceId) {
            workspace.order = index;
            return true;
          }
          return false;
        });
        initialState.dialogEditWorkspace = { form: workspace };

        document.title = `Edit Workspace "${getWorkspaceName(workspace)}"`;
      } else if (window.mode === 'open-url-with') {
        document.title = 'Open Link With';
      } else if (window.mode === 'notifications') {
        document.title = 'Notifications';
      } else if (window.mode === 'display-media') {
        document.title = 'Share your Screen';
      } else if (window.mode === 'go-to-url') {
        document.title = 'Go to URL';
      } else if (window.mode === 'add-workspace') {
        document.title = 'Add Custom Workspace';
      } else {
        document.title = appJson.name;
      }

      if (window.mode !== 'main'
      && window.mode !== 'menubar'
      && window.mode !== 'preferences'
      && window.mode !== 'workspace-preferences') {
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            if (window.preventClosingWindow) {
              return;
            }
            window.remote.getCurrentWindow().close();
          }
        });
      }

      const store = configureStore(initialState);
      return store;
    })
    .then((store) => {
      ReactDOM.render(
        <Provider store={store}>
          <AppWrapper>
            <React.Suspense fallback={<div />}>
              <App />
            </React.Suspense>
          </AppWrapper>
        </Provider>,
        document.getElementById('app'),
      );
    });
};

runApp();
