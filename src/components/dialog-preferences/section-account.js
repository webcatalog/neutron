/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable no-constant-condition */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {
  requestOpenInBrowser,
} from '../../senders';

import connectComponent from '../../helpers/connect-component';

import billingPlans from '../../constants/billing-plans';

const SectionAccount = ({
  currentPlan,
  displayName,
  isSignedIn,
  photoURL,
}) => (
  <>
    <List disablePadding dense>
      {!isSignedIn ? (
        <ListItem button onClick={() => requestOpenInBrowser('https://accounts.webcatalog.app/token')}>
          <ListItemText primary="Sign in to WebCatalog" />
          <ChevronRightIcon color="action" />
        </ListItem>
      ) : (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={displayName} src={photoURL} />
            </ListItemAvatar>
            <ListItemText
              primary={displayName}
              secondary={billingPlans[currentPlan].name}
            />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => requestOpenInBrowser('https://accounts.webcatalog.app/settings')}>
            <ListItemText primary="Manage Your Account" />
            <ChevronRightIcon color="action" />
          </ListItem>
        </>
      )}
    </List>
  </>
);

SectionAccount.defaultProps = {
  currentPlan: 'basic',
  displayName: '',
  isSignedIn: false,
  photoURL: null,
};

SectionAccount.propTypes = {
  currentPlan: PropTypes.oneOf(['basic', 'lifetime', 'plus', 'pro']),
  displayName: PropTypes.string,
  isSignedIn: PropTypes.bool,
  photoURL: PropTypes.string,
};

const mapStateToProps = (state) => ({
  isSignedIn: state.user.isSignedIn,
  currentPlan: state.user.publicProfile.billingPlan,
  displayName: state.user.displayName,
  photoURL: state.user.photoURL,
});

export default connectComponent(
  SectionAccount,
  mapStateToProps,
);
