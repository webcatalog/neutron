import {
  getPreference,
  requestShowLicenseRegistrationWindow,
} from '../senders';

const checkLicense = () => {
  const appJson = window.remote.getGlobal('appJson');
  const isSinglebox = appJson.id === 'singlebox';
  const utmSource = isSinglebox ? 'singlebox_app' : 'juli_app';

  if (isSinglebox) {
    if (!getPreference('registered')) {
      requestShowLicenseRegistrationWindow();
      return false;
    }
    return true;
  }

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
