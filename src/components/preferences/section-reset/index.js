/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { dialog, getCurrentWindow } from '@electron/remote';
import { ipcRenderer } from 'electron';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import {
  enqueueRequestRestartSnackbar,
  requestResetPreferences,
} from '../../../senders';

const SectionReset = () => (
  <List disablePadding dense>
    <ListItem
      button
      onClick={() => {
        dialog.showMessageBox(getCurrentWindow(), {
          type: 'question',
          buttons: ['Reset Now', 'Cancel'],
          message: `Are you sure? All preferences will be restored to their original defaults. Browsing data & ${getWorkspaceFriendlyName(true).toLowerCase()} won't be affected. This action cannot be undone.`,
          cancelId: 1,
        }).then(({ response }) => {
          if (response === 0) {
            ipcRenderer.once('set-preferences', () => {
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
);

export default SectionReset;
