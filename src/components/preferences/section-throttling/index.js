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
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../../senders';

const SectionThrottling = ({
  backgroundThrottling,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary={`Throttle ${getWorkspaceFriendlyName(true).toLowerCase()} running in background`}
        secondary={`Throttle animations and timers when ${getWorkspaceFriendlyName(true).toLowerCase()} are running in background to reduce CPU usage and extend battery life.`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={backgroundThrottling}
          onChange={(e) => {
            requestSetPreference('backgroundThrottling', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionThrottling.propTypes = {
  backgroundThrottling: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  backgroundThrottling: state.preferences.backgroundThrottling,
});

export default connectComponent(
  SectionThrottling,
  mapStateToProps,
);
