/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import { systemPreferences } from '@electron/remote';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Switch from '@mui/material/Switch';

import { useDispatch, useSelector } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

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

const SectionPrivacySecurity = () => {
  const dispatch = useDispatch();

  const appLockTimeout = useSelector((state) => state.preferences.appLockTimeout);
  const appLockWhenSwitchingWorkspace = useSelector(
    (state) => state.preferences.appLockWhenSwitchingWorkspace,
  );
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
    && systemPreferences.canPromptTouchID();

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
            sx={{
              '& .MuiListItemText-primary': {
                float: 'right',
                pr: 1,
              },
            }}
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
            sx={{
              borderRadius: 0.5,
              fontSize: '0.84375rem',
              my: 1,
              '& .MuiSelect-select': {
                py: 1,
                pr: 3.25,
                pl: 1.5,
              },
            }}
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
