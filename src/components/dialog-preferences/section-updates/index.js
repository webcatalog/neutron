/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import isMas from '../../../helpers/is-mas';
import isStandalone from '../../../helpers/is-standalone';

import {
  requestCheckForUpdates,
  requestSetPreference,
} from '../../../senders';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
};

const getUpdaterDesc = (status, info) => {
  if (status === 'download-progress') {
    if (info != null) {
      const { transferred, total, bytesPerSecond } = info;
      return `Downloading updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
    }
    return 'Downloading updates...';
  }
  if (status === 'checking-for-update') {
    return 'Checking for updates...';
  }
  if (status === 'update-available') {
    return 'Downloading updates...';
  }
  if (status === 'update-downloaded') {
    if (info && info.version) return `A new version (${info.version}) has been downloaded.`;
    return 'A new version has been downloaded.';
  }
  return null;
};

const SectionUpdates = ({
  autoCheckForUpdates,
  classes,
  updaterInfo,
  updaterStatus,
}) => {
  if (isMas()) return null;

  if (isStandalone()) {
    return (
      <Paper elevation={0} className={classes.paper}>
        <List disablePadding dense>
          <ListItem
            button
            onClick={() => requestCheckForUpdates(false)}
            disabled={updaterStatus === 'checking-for-update'
              || updaterStatus === 'download-progress'
              || updaterStatus === 'download-progress'
              || updaterStatus === 'update-available'}
          >
            <ListItemText
              primary={updaterStatus === 'update-downloaded' ? 'Restart to Apply Updates' : 'Check for Updates'}
              secondary={getUpdaterDesc(updaterStatus, updaterInfo)}
            />
            <ChevronRightIcon color="action" />
          </ListItem>
        </List>
      </Paper>
    );
  }

  return (
    <Paper elevation={0} className={classes.paper}>
      <List disablePadding dense>
        <ListItem
          button
          onClick={requestCheckForUpdates}
        >
          <ListItemText
            primary="Check for updates"
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText primary="Check for updates automatically" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={autoCheckForUpdates}
              onChange={(e) => {
                requestSetPreference('autoCheckForUpdates', e.target.checked);
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </Paper>
  );
};

SectionUpdates.defaultProps = {
  updaterInfo: null,
  updaterStatus: null,
};

SectionUpdates.propTypes = {
  autoCheckForUpdates: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  updaterInfo: PropTypes.object,
  updaterStatus: PropTypes.string,
};

const mapStateToProps = (state) => ({
  autoCheckForUpdates: state.preferences.autoCheckForUpdates,
  updaterInfo: state.updater.info,
  updaterStatus: state.updater.status,
});

export default connectComponent(
  SectionUpdates,
  mapStateToProps,
  null,
  styles,
);
