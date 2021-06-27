/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';
import isMas from '../../../helpers/is-mas';
import isStandalone from '../../../helpers/is-standalone';
import getStaticGlobal from '../../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import {
  getIapFormattedPriceAsync,
} from '../../../invokers';

const SectionAccountLicensing = ({
  iapPurchased,
  standaloneRegistered,
}) => {
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
      setFormattedPrice('25 USD');
    }
  }, [appJson, setFormattedPrice, registered]);

  return (
    <List disablePadding dense>
      <ListItem button onClick={null} disabled>
        <ListItemText primary={registered ? `${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'} is activated.` : `Upgrade to ${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'} (${formattedPrice ? `${formattedPrice}, ` : ''}one-time payment for lifetime use) to unlock all features & add unlimited number of ${getWorkspaceFriendlyName(true).toLowerCase()}.`} />
      </ListItem>
      {!registered && (
        <>
          <Divider />
          <ListItem button onClick={checkLicense}>
            <ListItemText primary={`Upgrade to ${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'}`} />
            <ChevronRightIcon color="action" />
          </ListItem>
        </>
      )}
    </List>
  );
};

SectionAccountLicensing.defaultProps = {
  iapPurchased: false,
  standaloneRegistered: false,
};

SectionAccountLicensing.propTypes = {
  iapPurchased: PropTypes.bool,
  standaloneRegistered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  iapPurchased: state.preferences.iapPurchased,
  standaloneRegistered: state.preferences.standaloneRegistered,
});

export default connectComponent(
  SectionAccountLicensing,
  mapStateToProps,
);
