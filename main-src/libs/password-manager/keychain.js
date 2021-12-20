/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

/* Modified from https://github.com/minbrowser/min/blob/7749a35ea71a5f373c05e1d587b620a7a5f7c1fc/js/passwordManager/keychain.js */
const { app } = require('electron');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const CryptoJS = require('crypto-js');
const keytar = require('keytar');

const appJson = require('../../constants/app-json');

const generateStrongPassword = require('./generate-strong-password');

class Keychain {
  constructor() {
    this.name = 'Built-in password manager';
    this.keychainServiceName = `${appJson.id}/web`;
    this.dbPath = path.join(app.getPath('userData'), 'keychain-db.sqlite');
    this.masterKey = null;
  }

  async getMasterKey() {
    // if the key is found in memory, return it
    if (this.masterKey) {
      return this.masterKey;
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

  async getDb() {
    const db = await open({
      filename: this.dbPath,
      driver: sqlite3.cached.Database,
    });

    await db.exec('CREATE TABLE IF NOT EXISTS password (id INTEGER PRIMARY KEY AUTOINCREMENT, domain TEXT, username TEXT, password TEXT, UNIQUE(domain, username))');

    return db;
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
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  isUnlocked() {
    return true;
  }

  async getSuggestions(domain) {
    const db = await this.getDb();

    const results = await db.all('SELECT domain, username, password FROM password WHERE domain=?', [domain]);

    const masterKey = await this.getMasterKey();
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
    const db = await this.getDb();

    const masterKey = await this.getMasterKey();
    const encryptedPassword = this.encryptPassword(masterKey, password);

    if (id) {
      await db.run('UPDATE password domain=:domain, username=:username, password=:password WHERE id=:id', {
        ':domain': domain,
        ':username': username,
        ':password': encryptedPassword,
        ':id': id,
      });
    } else {
      await db.run('REPLACE INTO password (domain, username, password) VALUES (:domain, :username, :password)', {
        ':domain': domain,
        ':username': username,
        ':password': encryptedPassword,
      });
    }
  }

  async deleteCredential(id) {
    const db = await this.getDb();

    await db.run('DELETE FROM password WHERE id=?', [id]);
  }

  async getAllCredentials() {
    const db = await this.getDb();

    const results = await db.all('SELECT id, domain, username, password FROM password');

    const masterKey = await this.getMasterKey();
    return results.map((item) => ({
      ...item,
      password: this.decryptPassword(masterKey, item.password),
      manager: 'Keychain',
    }));
  }
}

module.exports = Keychain;
