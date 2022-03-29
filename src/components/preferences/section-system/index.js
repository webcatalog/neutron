/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

import { useSelector } from 'react-redux';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
  requestSetSystemPreference,
} from '../../../senders';

import ListItemDefaultMailClient from './list-item-default-mail-client';
import ListItemDefaultBrowser from './list-item-default-browser';
import ListItemDefaultCalendarApp from './list-item-default-calendar-app';

const SectionSystem = () => {
  const attachToMenubar = useSelector((state) => state.preferences.attachToMenubar);
  const openAtLogin = useSelector((state) => state.systemPreferences.openAtLogin);
  const runInBackground = useSelector((state) => state.preferences.runInBackground);

  return (
    <List disablePadding dense>
      {window.process.platform !== 'darwin' && (
        <>
          <ListItem>
            <ListItemText
              primary="Run in background"
              secondary="Keep the app running in background even when all windows are closed."
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={attachToMenubar || runInBackground}
                disabled={attachToMenubar}
                onChange={(e) => {
                  requestSetPreference('runInBackground', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
        </>
      )}
      <ListItem>
        <ListItemText primary="Open at login" />
        <Select
          value={openAtLogin}
          onChange={(e) => requestSetSystemPreference('openAtLogin', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          sx={{
            '& .MuiSelect-select': {
              py: 1,
              pr: 3.25,
              pl: 1.5,
            },
            borderRadius: 0.5,
            fontSize: '0.84375rem',
            my: 1,
          }}
        >
          <MenuItem dense value="yes">Yes</MenuItem>
          {window.process.platform === 'darwin' && (
            <MenuItem dense value="yes-hidden">Yes, but minimized</MenuItem>
          )}
          <MenuItem dense value="no">No</MenuItem>
        </Select>
      </ListItem>
      <Divider />
      <ListItemDefaultMailClient />
      <Divider />
      <ListItemDefaultCalendarApp />
      <Divider />
      <ListItemDefaultBrowser />
    </List>
  );
};

export default SectionSystem;
