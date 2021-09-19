/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const getKeytarVaultName = () => {
  // https://github.com/atom/node-keytar
  let vaultName;
  switch (window.process.platform) {
    case 'darwin':
      vaultName = 'Apple Keychain';
      break;
    case 'linux':
      vaultName = 'Secret Service API/libsecret';
      break;
    case 'win32':
      vaultName = 'Windows Credential Manager';
      break;
    default:
      vaultName = 'Unknown Vault';
  }
  return vaultName;
};

export default getKeytarVaultName;
