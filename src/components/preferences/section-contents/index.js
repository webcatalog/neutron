/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionBrowsing = ({
  blockAds,
  blockJavascript,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary="Block ads &amp; trackers"
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={blockAds}
          onChange={(e) => {
            if (!checkLicense()) {
              return;
            }

            requestSetPreference('blockAds', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
    <ListItem>
      <ListItemText
        primary="Disable Javascript"
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={blockJavascript}
          onChange={(e) => {
            requestSetPreference('blockJavascript', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionBrowsing.propTypes = {
  blockAds: PropTypes.bool.isRequired,
  blockJavascript: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  blockAds: state.preferences.blockAds,
  blockJavascript: state.preferences.blockJavascript,
});

export default connectComponent(
  SectionBrowsing,
  mapStateToProps,
);
