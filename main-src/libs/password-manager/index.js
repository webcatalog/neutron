/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Modified from https://github.com/minbrowser/min/blob/7749a35ea71a5f373c05e1d587b620a7a5f7c1fc/js/passwordManager/passwordManager.js */
const { ipcRenderer, ipcMain, dialog } = require('electron');

const Keychain = require('./keychain');
const l = require('./get-locale');
const { getPreference, setPreference } = require('../preferences');
const mainWindow = require('../../windows/main');
const preferencesWindow = require('../../windows/preferences');

const PasswordManagers = {
  // List of supported password managers. Each password manager is expected to
  // have getSuggestions(domain) method that returns a Promise with credentials
  // suggestions matching given domain name.
  managers: [
    new Keychain(),
  ],
  // Returns an active password manager, which is the one that is selected in app's
  // settings.
  getActivePasswordManager() {
    return PasswordManagers.managers[0];
  },
  async getConfiguredPasswordManager() {
    const manager = PasswordManagers.getActivePasswordManager();
    if (!manager) {
      return null;
    }

    const configured = await manager.checkIfConfigured();
    if (!configured) {
      return null;
    }

    return manager;
  },
  // Shows a prompt dialog for password store's master password.
  async promptForMasterPassword(manager) {
    return new Promise((resolve, reject) => {
      const { password } = ipcRenderer.sendSync('prompt', {
        text: l('passwordManagerUnlock').replace('%p', manager.name),
        values: [{ placeholder: l('password'), id: 'password', type: 'password' }],
        ok: l('dialogConfirmButton'),
        cancel: l('dialogSkipButton'),
        height: 160,
      });
      if (password === null || password === '') {
        reject(new Error('No password provided'));
      } else {
        resolve(password);
      }
    });
  },
  async unlock(manager) {
    let success = false;
    while (!success) {
      let password;
      try {
        // eslint-disable-next-line no-await-in-loop
        password = await PasswordManagers.promptForMasterPassword(manager);
      } catch (e) {
        // dialog was canceled
        break;
      }
      try {
        // eslint-disable-next-line no-await-in-loop
        success = await manager.unlockStore(password);
      } catch (e) {
        // incorrect password, prompt again
      }
    }
    return success;
  },
  /* https://github.com/minbrowser/min/blob/7749a35ea71a5f373c05e1d587b620a7a5f7c1fc/js/passwordManager/passwordCapture.js */
  handlingRecieveCredentials: false,
  handleRecieveCredentials(e, args) {
    const [rawDomain, username, password] = args;
    let domain = rawDomain;
    if (rawDomain.startsWith('www.')) {
      domain = domain.slice(4);
    }

    if (getPreference('passwordsNeverSaveDomains') && getPreference('passwordsNeverSaveDomains').includes(domain)) {
      return;
    }

    PasswordManagers.getConfiguredPasswordManager().then((manager) => {
      if (!manager || !manager.saveCredential) {
        // the password can't be saved
        return;
      }

      // check if this username/password combo is already saved
      manager.getSuggestions(domain).then((credentials) => {
        const alreadyExists = credentials
          .some((cred) => cred.username === username && cred.password === password);
        if (!alreadyExists) {
          const goSave = () => {
            manager.saveCredential(domain, username, password);

            // notify preferences window that credentials have to be reloaded
            const prefWin = preferencesWindow.get();
            if (prefWin) {
              prefWin.send('password-credentials-added');
            }
          };

          const goNeverSave = () => {
            setPreference('passwordsNeverSaveDomains', (getPreference('passwordsNeverSaveDomains') || []).concat([domain]));
          };

          // this helps avoiding showing too many dialogs
          // as some sites like Help Scout triggers onSubmit multiple times
          if (PasswordManagers.handlingRecieveCredentials) return;
          PasswordManagers.handlingRecieveCredentials = true;
          dialog.showMessageBox(mainWindow.get(), {
            type: 'question',
            buttons: [l('passwordCaptureSave'), l('passwordCaptureDontSave'), l('passwordCaptureNeverSave')],
            message: l('passwordCaptureSavePassword').replace('%s', domain),
            cancelId: 1,
            defaultId: 0,
          })
            .then(({ response }) => {
              if (response === 0) {
                goSave();
              } else if (response === 2) {
                goNeverSave();
              }
            })
            // eslint-disable-next-line
            .catch(console.log)
            .then(() => {
              PasswordManagers.handlingRecieveCredentials = false;
            });
        }
      });
    });
  },
  // Binds IPC events.
  initialize() {
    // Called when page preload script detects a form with username and password.
    ipcMain.on('password-autofill', (e, hostname) => {
      // We expect hostname of the source page/frame as a parameter.
      if (!hostname) {
        return;
      }

      PasswordManagers.getConfiguredPasswordManager().then(async (manager) => {
        if (!manager) {
          return;
        }

        if (!manager.isUnlocked()) {
          await PasswordManagers.unlock(manager);
        }

        let domain = hostname;
        if (domain.startsWith('www.')) {
          domain = domain.slice(4);
        }

        manager.getSuggestions(domain).then((credentials) => {
          if (credentials != null) {
            const topLevelURL = e.sender.getURL();
            let topLevelDomain = new URL(topLevelURL).hostname;
            if (topLevelDomain.startsWith('www.')) {
              topLevelDomain = topLevelDomain.slice(4);
            }
            if (domain !== topLevelDomain) {
              // eslint-disable-next-line no-console
              console.warn("autofill isn't supported for 3rd-party frames");
              return;
            }
            e.sender.send('password-autofill-match', {
              credentials,
              hostname,
            });
          }
        }).catch(() => {
          // eslint-disable-next-line no-console
          console.error(`Failed to get password suggestions: ${e.message}`);
        });
      });
    });

    ipcMain.on('password-autofill-check', (e) => {
      // removed this in the future
      // we temporarily disable autofill support in production
      if (process.env.NODE_ENV === 'production') {
        return;
      }

      if (global.passwordManagerExtensionDetected || !getPreference('passwordsAskToSave') || PasswordManagers.managers.length < 1) {
        return;
      }

      e.sender.send('password-autofill-enabled');
    });

    ipcMain.on('password-form-filled', PasswordManagers.handleRecieveCredentials);

    ipcMain.handle('password-get-all-credentials', () => PasswordManagers.getActivePasswordManager()
      .getAllCredentials());
    ipcMain.handle('password-save-credential', (e, domain, username, password) => PasswordManagers.getActivePasswordManager()
      .saveCredential(domain, username, password));
    ipcMain.handle('password-delete-credential', (e, domain, username) => PasswordManagers.getActivePasswordManager()
      .deleteCredential(domain, username));

    // keybindings.defineShortcut('fillPassword', () => {
    //   webviews.callAsync(tabs.getSelected(), 'send', ['password-autofill-shortcut']);
    // });
  },
};

module.exports = PasswordManagers;
