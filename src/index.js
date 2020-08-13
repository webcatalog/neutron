import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto/index.css';

import store from './state';
import { init as initDialogCodeInjection } from './state/dialog-code-injection/actions';
import { init as initDialogCustomUserAgent } from './state/dialog-custom-user-agent/actions';
import { init as initDialogEditWorkspace } from './state/dialog-edit-workspace/actions';
import { init as initDialogProxy } from './state/dialog-proxy/actions';
import { init as initDialogSpellcheckLanguages } from './state/dialog-spellcheck-languages/actions';

import AppWrapper from './components/app-wrapper';

import getWorkspacesAsList from './helpers/get-workspaces-as-list';

const DialogAbout = React.lazy(() => import('./components/dialog-about'));
const DialogAddWorkspace = React.lazy(() => import('./components/dialog-add-workspace'));
const DialogAuth = React.lazy(() => import('./components/dialog-auth'));
const DialogCodeInjection = React.lazy(() => import('./components/dialog-code-injection'));
const DialogCustomUserAgent = React.lazy(() => import('./components/dialog-custom-user-agent'));
const DialogDisplayMedia = React.lazy(() => import('./components/dialog-display-media'));
const DialogEditWorkspace = React.lazy(() => import('./components/dialog-edit-workspace'));
const DialogGoToUrl = React.lazy(() => import('./components/dialog-go-to-url'));
const DialogLicenseRegistration = React.lazy(() => import('./components/dialog-license-registration'));
const DialogNotifications = React.lazy(() => import('./components/dialog-notifications'));
const DialogOpenUrlWith = React.lazy(() => import('./components/dialog-open-url-with'));
const DialogPreferences = React.lazy(() => import('./components/dialog-preferences'));
const DialogProxy = React.lazy(() => import('./components/dialog-proxy'));
const DialogSpellcheckLanguages = React.lazy(() => import('./components/dialog-spellcheck-languages'));
const Main = React.lazy(() => import('./components/main'));

const App = () => {
  switch (window.mode) {
    case 'about': return <DialogAbout />;
    case 'add-workspace': return <DialogAddWorkspace />;
    case 'auth': return <DialogAuth />;
    case 'code-injection': return <DialogCodeInjection />;
    case 'custom-user-agent': return <DialogCustomUserAgent />;
    case 'display-media': return <DialogDisplayMedia />;
    case 'edit-workspace': return <DialogEditWorkspace />;
    case 'go-to-url': return <DialogGoToUrl />;
    case 'license-registration': return <DialogLicenseRegistration />;
    case 'notifications': return <DialogNotifications />;
    case 'open-url-with': return <DialogOpenUrlWith />;
    case 'preferences': return <DialogPreferences />;
    case 'proxy': return <DialogProxy />;
    case 'spellcheck-languages': return <DialogSpellcheckLanguages />;
    default: return <Main />;
  }
};

const runApp = () => {
  Promise.resolve()
    .then(() => {
      if (window.mode === 'about') {
        document.title = 'About';
      } else if (window.mode === 'auth') {
        document.title = 'Sign In';
      } else if (window.mode === 'preferences') {
        document.title = 'Preferences';
      } else if (window.mode === 'edit-workspace') {
        store.dispatch(initDialogEditWorkspace());
        const { workspaces } = store.getState();
        const workspaceList = getWorkspacesAsList(workspaces);
        const editWorkspaceId = window.remote.getGlobal('editWorkspaceId');
        const workspace = workspaces[editWorkspaceId];
        workspaceList.some((item, index) => {
          if (item.id === editWorkspaceId) {
            workspace.order = index;
            return true;
          }
          return false;
        });
        document.title = workspace.name ? `Edit Workspace ${workspace.order + 1} "${workspace.name}"` : `Edit Workspace ${workspace.order + 1}`;
      } else if (window.mode === 'open-url-with') {
        document.title = 'Open Link With';
      } else if (window.mode === 'code-injection') {
        store.dispatch(initDialogCodeInjection());
        const codeInjectionType = window.remote.getGlobal('codeInjectionType');
        document.title = `Edit ${codeInjectionType.toUpperCase()} Code Injection`;
      } else if (window.mode === 'notifications') {
        document.title = 'Notifications';
      } else if (window.mode === 'display-media') {
        document.title = 'Share your Screen';
      } else if (window.mode === 'custom-user-agent') {
        store.dispatch(initDialogCustomUserAgent());
        document.title = 'Edit Custom User Agent';
      } else if (window.mode === 'go-to-url') {
        document.title = 'Go to URL';
      } else if (window.mode === 'proxy') {
        store.dispatch(initDialogProxy());
        document.title = 'Proxy Settings';
      } else if (window.mode === 'spellcheck-languages') {
        store.dispatch(initDialogSpellcheckLanguages());
        document.title = 'Spell Checking Languages';
      } else if (window.mode === 'add-workspace') {
        document.title = 'Add Custom Workspace';
      } else if (window.mode === 'license-registration') {
        document.title = 'License Registration';
      } else {
        document.title = window.remote.getGlobal('appJson').name;
      }

      if (window.mode !== 'main' && window.mode !== 'menubar') {
        document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            if (window.preventClosingWindow) {
              return;
            }
            window.remote.getCurrentWindow().close();
          }
        });
      }
    });

  ReactDOM.render(
    <Provider store={store}>
      <AppWrapper>
        <CssBaseline />
        <React.Suspense fallback={<div />}>
          <App />
        </React.Suspense>
      </AppWrapper>
    </Provider>,
    document.getElementById('app'),
  );
};

runApp();
