/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { useSelector } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTitlebar = () => {
  const autoHideMenuBar = useSelector((state) => state.preferences.autoHideMenuBar);
  const useSystemTitleBar = useSelector((state) => state.preferences.useSystemTitleBar);
  const useSystemWindowButtons = useSelector((state) => state.preferences.useSystemWindowButtons);

  if (window.process.platform === 'darwin') return null;

  return (
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
      {window.process.platform === 'win32' && (
        <ListItem>
          <ListItemText
            primary="Use native window (maximizing/minimizing/closing) buttons"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={useSystemTitleBar || useSystemWindowButtons}
              disabled={useSystemTitleBar}
              onChange={(e) => {
                requestSetPreference('useSystemWindowButtons', e.target.checked);
                enqueueRequestRestartSnackbar();
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      )}
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
};

export default SectionTitlebar;
