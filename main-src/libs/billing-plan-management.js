/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const {
  dialog,
  shell,
  inAppPurchase,
} = require('electron');

const isMas = require('./is-mas');
const isBundled = require('./is-bundled');
const getIapFormattedPriceAsync = require('./get-iap-formatted-price-async');
const getUtmSource = require('./get-utm-source');
const { getPreference } = require('./preferences');

const mainWindow = require('../windows/main');
const preferencesWindow = require('../windows/preferences');
const workspacePreferencesWindow = require('../windows/workspace-preferences');

const appJson = require('../constants/app-json');

let billingPlan = 'basic';

const getBillingPlan = () => billingPlan;

const setBillingPlan = (newValue) => { billingPlan = newValue; };

const showRequireLicenseDialog = (reason = 'Your current plan does not include this feature') => {
  const utmSource = getUtmSource();
  const win = workspacePreferencesWindow.get() || preferencesWindow.get() || mainWindow.get();

  if (isBundled()) {
    dialog.showMessageBox(win, {
      type: 'info',
      message: `${reason}. Please upgrade to continue.`,
      buttons: ['Upgrade Now...', 'Learn More...', 'Later'],
      cancelId: 2,
      defaultId: 0,
    })
      .then(({ response }) => {
        if (response === 0) {
          shell.openExternal(`https://accounts.webcatalog.app/settings/billing?utm_source=${utmSource}`);
        } else if (response === 1) {
          shell.openExternal(`https://webcatalog.app/pricing?utm_source=${utmSource}`);
        }
      })
      .catch(console.log); // eslint-disable-line
    return;
  }

  if (isMas()) {
    const productIdentifier = `${appJson.id}_plus`;

    // get price
    getIapFormattedPriceAsync(productIdentifier)
      .then((formattedPrice) => {
        dialog.showMessageBox(win, {
          type: 'info',
          message: `Upgrade to ${appJson.name} Plus (${formattedPrice ? `${formattedPrice}, ` : ''}one-time payment) to unlock all features & add unlimited number of workspaces.`,
          buttons: [`Purchase${formattedPrice ? ` (${formattedPrice})` : ''}...`, 'Restore Purchase', 'Later'],
          cancelId: 2,
          defaultId: 0,
        })
          .then(({ response }) => {
            if (response === 0) {
              inAppPurchase.purchaseProduct(productIdentifier).then((isProductValid) => {
                if (!isProductValid) {
                  // eslint-disable-next-line no-console
                  console.log('The product is not valid.');
                  return;
                }

                // eslint-disable-next-line no-console
                console.log('The payment has been added to the payment queue.');
              });
            }

            if (response === 1) {
              inAppPurchase.restoreCompletedTransactions();
            }
          })
          .catch(console.log); // eslint-disable-line no-console
      });
  }
};

const defaultVerify = () => {
  if (isBundled()) {
    return billingPlan !== 'basic';
  }

  const iapPurchased = isMas() ? getPreference('iapPurchased') : false;
  return appJson.iapPurchased || iapPurchased;
};

const checkPlan = (reason, verify = defaultVerify) => {
  if (!verify()) {
    showRequireLicenseDialog(reason);
    return false;
  }

  return true;
};

module.exports = {
  getBillingPlan,
  setBillingPlan,
  showRequireLicenseDialog,
  checkPlan,
};
