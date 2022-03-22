/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { getCurrentWindow } from '@electron/remote';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';

import Preferences from './components/preferences';
import AddWorkspace from './components/add-workspace';
import Auth from './components/auth';
import DisplayMedia from './components/display-media';
import GoToUrl from './components/go-to-url';
import LicenseRegistration from './components/license-registration';
import Notifications from './components/notifications';
import OpenUrlWith from './components/open-url-with';
import WorkspacePreferences from './components/workspace-preferences';
import Main from './components/main';

import './amplitude';

import configureStore from './state';

import AppWrapper from './components/app-wrapper';

import getWorkspacesAsList from './helpers/get-workspaces-as-list';
import getStaticGlobal from './helpers/get-static-global';
import getWorkspaceFriendlyName from './helpers/get-workspace-friendly-name';

import { getReactInitialStateAsync } from './invokers';

if (getStaticGlobal('sentryEnabled')) {
  import('@sentry/electron/renderer')
    .then((Sentry) => {
      Sentry.init({});
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.log(err);
    });
}

const appJson = getStaticGlobal('appJson');

const App = () => {
  switch (window.mode) {
    case 'add-workspace': return <AddWorkspace />;
    case 'auth': return <Auth />;
    case 'display-media': return <DisplayMedia />;
    case 'go-to-url': return <GoToUrl />;
    case 'license-registration': return <LicenseRegistration />;
    case 'notifications': return <Notifications />;
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
        const incomingUrl = getStaticGlobal('incomingUrl');
        document.title = `Open ${incomingUrl} With`;
      } else if (window.mode === 'notifications') {
        document.title = 'Notifications';
      } else if (window.mode === 'display-media') {
        document.title = 'Share your Screen';
      } else if (window.mode === 'go-to-url') {
        document.title = 'Go to URL';
      } else if (window.mode === 'add-workspace') {
        document.title = appJson.url ? `Add Custom ${getWorkspaceFriendlyName()}` : `Add ${getWorkspaceFriendlyName()}`;
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
            getCurrentWindow().close();
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
