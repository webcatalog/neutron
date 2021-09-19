/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Modified from https://github.com/minbrowser/min/blob/7749a35ea71a5f373c05e1d587b620a7a5f7c1fc/js/passwordManager/passwordManager.js */
const { ipcRenderer, ipcMain } = require('electron');

const Keychain = require('./keychain');

// https://github.com/minbrowser/min/blob/3591f2bdb4dd1f3dd0b4ec05f40027cf1350f7c5/localization/languages/en-US.json
const localeMap = {
  passwordManagerUnlock: 'Enter your %p master password to unlock the password store:',
  password: 'Password',
  dialogConfirmButton: 'Confirm',
  dialogSkipButton: 'Cancel',
};
const l = (key) => localeMap(key);

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
    if (PasswordManagers.managers.length === 0) {
      return null;
    }

    return PasswordManagers.managers[0];

    // const managerSetting = settings.get('passwordManager');
    // if (managerSetting == null) {
    //   return PasswordManagers.managers.find((mgr) => mgr.name === 'Built-in password manager');
    // }

    // return PasswordManagers.managers.find((mgr) => mgr.name === managerSetting.name);
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
      if (PasswordManagers.getActivePasswordManager()) {
        e.sender.send('password-autofill-enabled');
      }
    });

    // keybindings.defineShortcut('fillPassword', () => {
    //   webviews.callAsync(tabs.getSelected(), 'send', ['password-autofill-shortcut']);
    // });
  },
};

module.exports = PasswordManagers;
