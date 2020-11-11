/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const checkLicense = () => {
  const appJson = window.remote.getGlobal('appJson');
  const utmSource = 'juli_app';

  if (!appJson.registered) {
    window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
      type: 'info',
      message: 'You are currently running the free version of WebCatalog which does not include this feature. To remove the limitations, please purchase the full version ($19.99) from our store.',
      buttons: ['OK', 'Learn More...'],
      cancelId: 0,
      defaultId: 0,
    })
      .then(({ response }) => {
        if (response === 1) {
          window.remote.shell.openExternal(`https://webcatalog.app/pricing?utm_source=${utmSource}`);
        }
      })
      .catch(console.log); // eslint-disable-line no-console
    return false;
  }
  return true;
};

export default checkLicense;
