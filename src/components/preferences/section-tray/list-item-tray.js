/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';

import { useSelector } from 'react-redux';

import checkLicense from '../../../helpers/check-license';
import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTray = () => {
  const attachToMenubar = useSelector((state) => state.preferences.attachToMenubar);
  const runInBackground = useSelector((state) => state.preferences.runInBackground);
  const trayIcon = useSelector((state) => state.preferences.trayIcon);

  return (
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
};

export default SectionTray;
