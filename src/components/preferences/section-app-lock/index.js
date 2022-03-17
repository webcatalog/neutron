/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import checkLicense from '../../../helpers/check-license';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import { open as openDialogAppLock } from '../../../state/dialog-app-lock/actions';

import DialogAppLock from './dialog-app-lock';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import {
  getAppLockStatusAsync,
} from '../../../invokers';

import appLockTimeouts from '../../../constants/app-lock-timeouts';

const useStyles = makeStyles((theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
  refreshEvery: {
    float: 'right',
    paddingRight: theme.spacing(1),
  },
}));

const SectionPrivacySecurity = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const appLockTimeout = useSelector((state) => state.preferences.appLockTimeout);
  // eslint-disable-next-line max-len
  const appLockWhenSwitchingWorkspace = useSelector((state) => state.preferences.appLockWhenSwitchingWorkspace);
  const dialogAppLockOpen = useSelector((state) => state.dialogAppLock.open);

  const [appLockEnabled, setAppLockEnabled] = useState(false);
  useEffect(() => {
    // re-run whenever the dialog is closed
    // as status might be changed
    if (!dialogAppLockOpen) {
      getAppLockStatusAsync()
        .then((status) => {
          setAppLockEnabled(Boolean(status.hasPassword));
        })
        // eslint-disable-next-line no-console
        .catch(console.log);
    }
  }, [dialogAppLockOpen, setAppLockEnabled]);

  const canPromptTouchId = window.process.platform === 'darwin'
    && window.remote.systemPreferences.canPromptTouchID();

  return (
    <>
      <List disablePadding dense>
        <ListItem
          button
          onClick={() => {
            if (!checkLicense()) {
              return;
            }

            dispatch(openDialogAppLock());
          }}
        >
          <ListItemText
            primary={appLockEnabled ? 'Change/Disable App Lock' : 'Enable App Lock'}
            secondary={`Protect this app from unauthorized access with password${canPromptTouchId ? ' or Touch ID' : ''}.`}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Lock the app after"
            classes={{ primary: classes.refreshEvery }}
          />
          <Select
            value={appLockTimeout}
            onChange={(e) => {
              requestSetPreference('appLockTimeout', e.target.value);
              enqueueRequestRestartSnackbar();
            }}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classes.selectRoot}
            disabled={!appLockEnabled}
          >
            {appLockTimeouts.map((opt) => (
              <MenuItem key={opt.value} dense value={opt.value}>
                {opt.value > 0 ? `${opt.name} of inactivity` : opt.name}
              </MenuItem>
            ))}
          </Select>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={`Ask for password when switching between ${getWorkspaceFriendlyName(true).toLowerCase()}`}
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={appLockWhenSwitchingWorkspace}
              onChange={(e) => {
                requestSetPreference('appLockWhenSwitchingWorkspace', e.target.checked);
                enqueueRequestRestartSnackbar();
              }}
              disabled={!appLockEnabled}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <DialogAppLock />
    </>
  );
};

export default SectionPrivacySecurity;
