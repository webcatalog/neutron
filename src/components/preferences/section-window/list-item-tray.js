/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';
import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTray = ({
  attachToMenubar,
  runInBackground,
  trayIcon,
}) => (
  <>
    <ListItem>
      <ListItemText
        primary={(() => {
          if (window.process.platform === 'darwin') { return 'Show menu bar icon'; }
          return 'Show tray (notification area) icon';
        })()}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={trayIcon || runInBackground || attachToMenubar}
          disabled={runInBackground || attachToMenubar}
          onChange={(e) => {
            requestSetPreference('trayIcon', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
    <Divider />
    <ListItem>
      <ListItemText
        primary={window.process.platform === 'darwin' ? 'Attach window to menu bar' : 'Pin window to system tray (notification area)'}
        secondary="Tip: Right-click on app icon to access context menu."
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={attachToMenubar}
          onChange={(e) => {
            // this feature is free with WebCatalog
            // but not free in MAS apps
            if (!isWebcatalog() && !checkLicense()) {
              return;
            }
            requestSetPreference('attachToMenubar', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </>
);

SectionTray.propTypes = {
  attachToMenubar: PropTypes.bool.isRequired,
  runInBackground: PropTypes.bool.isRequired,
  trayIcon: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  attachToMenubar: state.preferences.attachToMenubar,
  runInBackground: state.preferences.runInBackground,
  trayIcon: state.preferences.trayIcon,
});

export default connectComponent(
  SectionTray,
  mapStateToProps,
  null,
);
