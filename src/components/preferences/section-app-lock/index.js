/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';

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

const styles = (theme) => ({
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
});

const SectionPrivacySecurity = ({
  appLockTimeout,
  classes,
  dialogAppLockOpen,
  onOpenDialogAppLock,
}) => {
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

            onOpenDialogAppLock();
          }}
        >
          <ListItemText
            primary={appLockEnabled ? 'Change/Disable App Lock' : 'Enable App Lock'}
            secondary={`Protect this app from unauthorized access with password${canPromptTouchId ? ' or Touch ID' : ''}.`}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
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
      </List>
      <DialogAppLock />
    </>
  );
};

SectionPrivacySecurity.propTypes = {
  appLockTimeout: PropTypes.number.isRequired,
  classes: PropTypes.object.isRequired,
  dialogAppLockOpen: PropTypes.bool.isRequired,
  onOpenDialogAppLock: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogAppLock,
};

const mapStateToProps = (state) => ({
  appLockTimeout: state.preferences.appLockTimeout,
  dialogAppLockOpen: state.dialogAppLock.open,
});

export default connectComponent(
  SectionPrivacySecurity,
  mapStateToProps,
  actionCreators,
  styles,
);
