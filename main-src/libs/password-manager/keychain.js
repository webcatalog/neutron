/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Modified from https://github.com/minbrowser/min/blob/7749a35ea71a5f373c05e1d587b620a7a5f7c1fc/js/passwordManager/keychain.js */
const keytar = require('keytar');

const appJson = require('../../constants/app-json');

class Keychain {
  constructor() {
    this.name = 'Built-in password manager';
    this.keychainServiceName = `${appJson.name} Saved Passwords`;
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfConfigured() {
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  isUnlocked() {
    return true;
  }

  async getSuggestions(domain) {
    return keytar.findCredentials(this.keychainServiceName).then((results) => results
      .filter((result) => {
        try {
          return JSON.parse(result.account).domain === domain;
        } catch (e) {
          return false;
        }
      })
      .map((result) => ({
        username: JSON.parse(result.account).username,
        password: result.password,
        manager: 'Keychain',
      })));
  }

  // eslint-disable-next-line class-methods-use-this
  getSignInRequirements() {
    return [];
  }

  saveCredential(domain, username, password) {
    keytar.setPassword(this.keychainServiceName, JSON.stringify({ domain, username }), password);
  }

  deleteCredential(domain, username) {
    keytar.setPassword(this.keychainServiceName, JSON.stringify({ domain, username }));
  }

  getAllCredentials() {
    return keytar.findCredentials(this.keychainServiceName)
      .then((results) => results.map((result) => ({
        domain: JSON.parse(result.account).domain,
        username: JSON.parse(result.account).username,
        password: result.password,
        manager: 'Keychain',
      })));
  }
}

module.exports = Keychain;
