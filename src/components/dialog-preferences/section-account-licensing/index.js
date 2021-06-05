/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

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

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const SectionAccountLicensing = ({
  classes,
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
      setFormattedPrice('20 USD');
    }
  }, [appJson, setFormattedPrice, registered]);

  return (
    <Paper elevation={0} className={classes.paper}>
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
    </Paper>
  );
};

SectionAccountLicensing.defaultProps = {
  iapPurchased: false,
  standaloneRegistered: false,
};

SectionAccountLicensing.propTypes = {
  classes: PropTypes.object.isRequired,
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
  null,
  styles,
);
