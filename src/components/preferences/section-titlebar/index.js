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

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTitlebar = ({
  autoHideMenuBar,
  useSystemTitleBar,
}) => window.process.platform !== 'darwin' && (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary="Use native title bar and borders"
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={useSystemTitleBar}
          onChange={(e) => {
            requestSetPreference('useSystemTitleBar', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
    <ListItem>
      <ListItemText
        primary="Hide menu bar automatically"
        secondary="Auto hide the menu bar unless the Alt key is pressed."
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          disabled={!useSystemTitleBar}
          checked={useSystemTitleBar && autoHideMenuBar}
          onChange={(e) => {
            requestSetPreference('autoHideMenuBar', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionTitlebar.propTypes = {
  autoHideMenuBar: PropTypes.bool.isRequired,
  useSystemTitleBar: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  autoHideMenuBar: state.preferences.autoHideMenuBar,
  useSystemTitleBar: state.preferences.useSystemTitleBar,
});

export default connectComponent(
  SectionTitlebar,
  mapStateToProps,
);
