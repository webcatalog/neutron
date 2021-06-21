/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

import './amplitude';

import configureStore from './state';

import AppWrapper from './components/app-wrapper';

import getWorkspacesAsList from './helpers/get-workspaces-as-list';
import getStaticGlobal from './helpers/get-static-global';
import getWorkspaceFriendlyName from './helpers/get-workspace-friendly-name';

import { getReactInitialStateAsync } from './invokers';

const appJson = getStaticGlobal('appJson');

const AddWorkspace = React.lazy(() => import('./components/add-workspace'));
const Auth = React.lazy(() => import('./components/auth'));
const DisplayMedia = React.lazy(() => import('./components/display-media'));
const GoToUrl = React.lazy(() => import('./components/go-to-url'));
const LicenseRegistration = React.lazy(() => import('./components/license-registration'));
const Notifications = React.lazy(() => import('./components/notifications'));
const OpenSourceNotices = React.lazy(() => import('./components/open-source-notices'));
const OpenUrlWith = React.lazy(() => import('./components/open-url-with'));
const Preferences = React.lazy(() => import('./components/preferences'));
const WorkspacePreferences = React.lazy(() => import('./components/workspace-preferences'));
const Main = React.lazy(() => import('./components/main'));

const App = () => {
  switch (window.mode) {
    case 'add-workspace': return <AddWorkspace />;
    case 'auth': return <Auth />;
    case 'display-media': return <DisplayMedia />;
    case 'go-to-url': return <GoToUrl />;
    case 'license-registration': return <LicenseRegistration />;
    case 'notifications': return <Notifications />;
    case 'open-source-notices': return <OpenSourceNotices />;
    case 'open-url-with': return <OpenUrlWith />;
    case 'preferences': return <Preferences />;
    case 'workspace-preferences': return <WorkspacePreferences />;
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
      const { workspaces } = initialState.workspaces;

      if (window.mode === 'auth') {
        document.title = 'Sign In';
      } else if (window.mode === 'preferences') {
        document.title = 'Global Preferences';
      } else if (window.mode === 'workspace-preferences') {
        const workspaceId = getStaticGlobal('workspacePreferencesWorkspaceId');
        const workspaceList = getWorkspacesAsList(workspaces);
        const workspace = workspaces[workspaceId];
        workspaceList.some((item, index) => {
          if (item.id === workspaceId) {
            workspace.order = index;
            return true;
          }
          return false;
        });
        initialState.dialogWorkspacePreferences = {
          form: { ...workspace, preferences: workspace.preferences || {} },
        };

        document.title = `Edit ${getWorkspaceFriendlyName()} "${getWorkspaceName(workspace)}"`;
      } else if (window.mode === 'open-url-with') {
        document.title = 'Open Link With';
      } else if (window.mode === 'notifications') {
        document.title = 'Notifications';
      } else if (window.mode === 'display-media') {
        document.title = 'Share your Screen';
      } else if (window.mode === 'go-to-url') {
        document.title = 'Go to URL';
      } else if (window.mode === 'add-workspace') {
        document.title = appJson.url ? `Add Custom ${getWorkspaceFriendlyName()}` : `Add ${getWorkspaceFriendlyName()}`;
      } else if (window.mode === 'open-source-notices') {
        document.title = 'Open Source Notices';
      } else if (window.mode === 'license-registration') {
        document.title = 'License Registration';
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
