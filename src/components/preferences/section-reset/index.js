/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import {
  enqueueRequestRestartSnackbar,
  requestResetPreferences,
} from '../../../senders';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const SectionReset = ({
  classes,
}) => (
  <Paper elevation={0} className={classes.paper}>
    <List disablePadding dense>
      <ListItem
        button
        onClick={() => {
          window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
            type: 'question',
            buttons: ['Reset Now', 'Cancel'],
            message: `Are you sure? All preferences will be restored to their original defaults. Browsing data & ${getWorkspaceFriendlyName(true).toLowerCase()} won't be affected. This action cannot be undone.`,
            cancelId: 1,
          }).then(({ response }) => {
            if (response === 0) {
              window.ipcRenderer.once('set-preferences', () => {
                enqueueRequestRestartSnackbar();
              });
              requestResetPreferences();
            }
          }).catch(console.log); // eslint-disable-line
        }}
      >
        <ListItemText primary="Restore preferences to their original defaults" />
        <ChevronRightIcon color="action" />
      </ListItem>
    </List>
  </Paper>
);

SectionReset.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  SectionReset,
  null,
  null,
  styles,
);
