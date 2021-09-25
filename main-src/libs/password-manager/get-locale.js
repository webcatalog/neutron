/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// https://github.com/minbrowser/min/blob/3591f2bdb4dd1f3dd0b4ec05f40027cf1350f7c5/localization/languages/en-US.json
const localeMap = {
  passwordManagerUnlock: 'Enter your %p master password to unlock the password store:',
  password: 'Password',
  dialogConfirmButton: 'Confirm',
  dialogSkipButton: 'Cancel',
  passwordCaptureSavePassword: 'Save password for %s?',
  passwordCaptureSave: 'Save',
  passwordCaptureDontSave: 'Don\'t save',
  passwordCaptureNeverSave: 'Never save',
};
const l = (key) => {
  if (localeMap[key]) return localeMap[key];
  // eslint-disable-next-line no-console
  console.log(key, 'locale is missing');
  return key;
};

module.exports = l;
