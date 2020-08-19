import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import CssBaseline from '@material-ui/core/CssBaseline';

import 'typeface-roboto/index.css';

import configureStore from './state';

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
    .then(async () => {
      const initialState = await window.ipcRenderer.invoke('get-react-initial-state');

      if (window.mode === 'about') {
        document.title = 'About';
      } else if (window.mode === 'auth') {
        document.title = 'Sign In';
      } else if (window.mode === 'preferences') {
        document.title = 'Preferences';
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

        document.title = workspace.name ? `Edit Workspace ${workspace.order + 1} "${workspace.name}"` : `Edit Workspace ${workspace.order + 1}`;
      } else if (window.mode === 'open-url-with') {
        document.title = 'Open Link With';
      } else if (window.mode === 'code-injection') {
        const codeInjectionType = window.remote.getGlobal('codeInjectionType');
        initialState.dialogCodeInjection = {
          form: {
            code: initialState.preferences[`${codeInjectionType}CodeInjection`],
            // allowNodeInJsCodeInjection is only used for js injection
            allowNodeInJsCodeInjection: codeInjectionType === 'js' ? initialState.preferences.allowNodeInJsCodeInjection : false,
          },
        };
        document.title = `Edit ${codeInjectionType.toUpperCase()} Code Injection`;
      } else if (window.mode === 'notifications') {
        document.title = 'Notifications';
      } else if (window.mode === 'display-media') {
        document.title = 'Share your Screen';
      } else if (window.mode === 'custom-user-agent') {
        initialState.dialogCustomUserAgent = {
          form: { code: initialState.preferences.customUserAgent },
        };
        document.title = 'Edit Custom User Agent';
      } else if (window.mode === 'go-to-url') {
        document.title = 'Go to URL';
      } else if (window.mode === 'proxy') {
        initialState.dialogProxy = {
          proxyBypassRules: initialState.preferences.proxyBypassRules,
          proxyPacScript: initialState.preferences.proxyPacScript,
          proxyRules: initialState.preferences.proxyRules,
          proxyType: initialState.preferences.proxyType,
        };
        document.title = 'Proxy Settings';
      } else if (window.mode === 'spellcheck-languages') {
        initialState.dialogSpellcheckLanguages = {
          form: {
            spellcheckLanguages: initialState.preferences.spellcheckLanguages,
          },
        };
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

      const store = configureStore(initialState);
      return store;
    })
    .then((store) => {
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
    });
};

runApp();
