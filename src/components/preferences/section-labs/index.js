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

import connectComponent from '../../../helpers/connect-component';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionLabs = ({
  enableExperimentalWebPlatformFeatures,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText primary="Enable experimental web platform features" />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={enableExperimentalWebPlatformFeatures}
          onChange={(e) => {
            requestSetPreference('enableExperimentalWebPlatformFeatures', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionLabs.propTypes = {
  enableExperimentalWebPlatformFeatures: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  enableExperimentalWebPlatformFeatures: state.preferences.enableExperimentalWebPlatformFeatures,
});

export default connectComponent(
  SectionLabs,
  mapStateToProps,
);
