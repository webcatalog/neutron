/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core';

import { useSelector } from 'react-redux';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
  requestSetSystemPreference,
} from '../../../senders';

import ListItemDefaultMailClient from './list-item-default-mail-client';
import ListItemDefaultBrowser from './list-item-default-browser';
import ListItemDefaultCalendarApp from './list-item-default-calendar-app';

const useStyles = makeStyles((theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
}));

const SectionSystem = () => {
  const classes = useStyles();

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
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
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
