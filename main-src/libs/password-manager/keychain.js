/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Modified from https://github.com/minbrowser/min/blob/7749a35ea71a5f373c05e1d587b620a7a5f7c1fc/js/passwordManager/keychain.js */
const { app } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const CryptoJS = require('crypto-js');

const keytar = require('../keytar');
const appJson = require('../../constants/app-json');

const generateStrongPassword = require('./generate-strong-password');

class Keychain {
  constructor() {
    this.name = 'Built-in password manager';
    this.keychainServiceName = `${appJson.id}/web`;
    this.dbPath = path.join(app.getPath('userData'), 'keychain-db.sqlite');
    this.masterKey = undefined;
    this.db = undefined;
  }

  async getMasterKey() {
    // if the key is found in memory, return it
    if (this.masterKey) {
      return this.masterKey;
    }

    if (keytar == null) {
      return null;
    }

    const MASTER_KEY_ACCOUNT = 'master';

    // try to get master key from Keychain
    const storedMasterKey = await keytar.getPassword(this.keychainServiceName, MASTER_KEY_ACCOUNT);
    if (storedMasterKey != null) {
      this.masterKey = storedMasterKey; // cache the value in memory
      return storedMasterKey;
    }

    // key doesn't exist, create one, and save it to Keychain
    const newMasterKey = generateStrongPassword();
    await keytar.setPassword(this.keychainServiceName, MASTER_KEY_ACCOUNT, newMasterKey);
    this.masterKey = newMasterKey; // cache the value in memory
    return newMasterKey;
  }

  getDb() {
    if (this.db) {
      return this.db;
    }

    const db = new Database(this.dbPath);

    const stmt = db.prepare('CREATE TABLE IF NOT EXISTS password (id INTEGER PRIMARY KEY AUTOINCREMENT, domain TEXT, username TEXT, password TEXT, UNIQUE(domain, username))');
    stmt.run();

    this.db = db;
    return this.db;
  }

  // eslint-disable-next-line class-methods-use-this
  encryptPassword(masterKey, rawPassword) {
    const encryptedPassword = CryptoJS.AES.encrypt(rawPassword, masterKey).toString();
    return encryptedPassword;
  }

  // eslint-disable-next-line class-methods-use-this
  decryptPassword(masterKey, encryptedPassword) {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, masterKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // eslint-disable-next-line class-methods-use-this
  async checkIfConfigured() {
    return keytar != null;
  }

  async getSuggestions(domain) {
    const masterKey = await this.getMasterKey();
    if (!masterKey) return [];

    const db = this.getDb();

    const stmt = db.prepare('SELECT domain, username, password FROM password WHERE domain=?');
    const results = stmt.all(domain);

    return results.map((item) => ({
      ...item,
      password: this.decryptPassword(masterKey, item.password),
      manager: 'Keychain',
    }));
  }

  // eslint-disable-next-line class-methods-use-this
  getSignInRequirements() {
    return [];
  }

  async saveCredential(domain, username, password, id) {
    const masterKey = await this.getMasterKey();
    if (!masterKey) return;

    const db = this.getDb();
    const encryptedPassword = this.encryptPassword(masterKey, password);

    if (id) {
      const stmt = db.prepare('UPDATE password domain=?, username=?, password=? WHERE id=?');
      stmt.run(domain, username, encryptedPassword, id);
    } else {
      const stmt = db.prepare('REPLACE INTO password (domain, username, password) VALUES (?, ?, ?)');
      stmt.run(domain, username, encryptedPassword);
    }
  }

  async deleteCredential(id) {
    const masterKey = await this.getMasterKey();
    if (!masterKey) return;

    const db = this.getDb();

    const stmt = db.prepare('DELETE FROM password WHERE id=?');
    stmt.run(id);
  }

  async getAllCredentials() {
    const db = this.getDb();

    const stmt = db.prepare('SELECT id, domain, username, password FROM password');
    const results = stmt.all();

    const masterKey = await this.getMasterKey();

    if (!masterKey) return [];

    return results.map((item) => ({
      ...item,
      password: this.decryptPassword(masterKey, item.password),
      manager: 'Keychain',
    }));
  }
}

module.exports = Keychain;
