/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect } from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useSelector } from 'react-redux';

import checkLicense from '../../../helpers/check-license';
import isMas from '../../../helpers/is-mas';
import isStandalone from '../../../helpers/is-standalone';
import getStaticGlobal from '../../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import {
  getIapFormattedPriceAsync,
} from '../../../invokers';

import {
  requestRestorePurchase,
} from '../../../senders';

const SectionAccountLicensing = () => {
  const iapPurchased = useSelector((state) => state.preferences.iapPurchased);
  const standaloneRegistered = useSelector((state) => state.preferences.standaloneRegistered);

  const appJson = getStaticGlobal('appJson');
  const registered = appJson.registered || iapPurchased || standaloneRegistered;

  const [formattedPrice, setFormattedPrice] = useState(null);
  useEffect(() => {
    if (isMas() && !registered) {
      getIapFormattedPriceAsync(appJson.iapProductIdentifier)
        .then((value) => {
          setFormattedPrice(value);
        });
    } else if (isStandalone()) {
      setFormattedPrice(appJson.price || '25 USD');
    }
  }, [appJson, setFormattedPrice, registered]);

  return (
    <List disablePadding dense>
      <ListItem button onClick={null} disabled>
        <ListItemText
          primary={registered ? `${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'} is activated.` : `Upgrade to ${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'} (${formattedPrice ? `${formattedPrice}, ` : ''}one-time payment for lifetime use) to unlock all features & add unlimited number of ${getWorkspaceFriendlyName(true).toLowerCase()}.`}
        />
      </ListItem>
      {!registered && (
        <>
          <Divider />
          <ListItem button onClick={checkLicense}>
            <ListItemText primary={`Upgrade to ${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'}...`} />
            <ChevronRightIcon color="action" />
          </ListItem>
          {isMas() && (
            <>
              <Divider />
              <ListItem button onClick={requestRestorePurchase}>
                <ListItemText primary="Restore Purchase..." />
                <ChevronRightIcon color="action" />
              </ListItem>
            </>
          )}
        </>
      )}
    </List>
  );
};

export default SectionAccountLicensing;
