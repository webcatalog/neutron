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
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionPerformance = ({
  hibernateWhenUnused,
  hibernateUnusedWorkspacesAtLaunch,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary={`Hibernate inactive ${getWorkspaceFriendlyName(true).toLowerCase()} automatically`}
        secondary={`When this is on, inactive ${getWorkspaceFriendlyName(true).toLowerCase()} will go to sleep to save system resources.`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={hibernateWhenUnused}
          onChange={(e) => {
            requestSetPreference('hibernateWhenUnused', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
    <ListItem>
      <ListItemText
        primary={`Hibernate inactive ${getWorkspaceFriendlyName(true).toLowerCase()} at app launch`}
        secondary={`Hibernate all ${getWorkspaceFriendlyName(true).toLowerCase()} at launch, excluding the active ${getWorkspaceFriendlyName().toLowerCase()}.`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={hibernateUnusedWorkspacesAtLaunch}
          onChange={(e) => {
            requestSetPreference('hibernateUnusedWorkspacesAtLaunch', e.target.checked);
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionPerformance.propTypes = {
  hibernateWhenUnused: PropTypes.bool.isRequired,
  hibernateUnusedWorkspacesAtLaunch: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  hibernateWhenUnused: state.preferences.hibernateWhenUnused,
  hibernateUnusedWorkspacesAtLaunch: state.preferences.hibernateUnusedWorkspacesAtLaunch,
});

export default connectComponent(
  SectionPerformance,
  mapStateToProps,
);
