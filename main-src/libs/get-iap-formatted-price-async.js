/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const { inAppPurchase } = require('electron');

const cached = {};

const getIapFormattedPriceAsync = (productIdentifier) => {
  if (cached[productIdentifier]) {
    return Promise.resolve(cached[productIdentifier]);
  }
  return inAppPurchase.getProducts([productIdentifier])
    .then((products) => {
      // Check the parameters.
      if (!Array.isArray(products) || products.length <= 0) {
        return null;
      }
      cached[productIdentifier] = products[0].formattedPrice;
      return products[0].formattedPrice;
    })
    .catch(() => null);
};

module.exports = getIapFormattedPriceAsync;
