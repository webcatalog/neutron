/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import { useSelector } from 'react-redux';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import ListItemShortcut from './list-item-shortcut';

const SectionWindow = () => {
  const alwaysOnTop = useSelector((state) => state.preferences.alwaysOnTop);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Keep window always on top"
          secondary="The window won't be hidden even when you click outside."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={alwaysOnTop}
            onChange={(e) => {
              requestSetPreference('alwaysOnTop', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItemShortcut />
    </List>
  );
};

export default SectionWindow;
