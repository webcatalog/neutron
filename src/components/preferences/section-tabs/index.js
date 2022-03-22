/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { useSelector } from 'react-redux';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTabs = () => {
  const useTabs = useSelector((state) => state.preferences.useTabs ?? true);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Tabs (under development)"
          secondary="Open links and documents in tabs instead of separate windows."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            defaultChecked={useTabs}
            onChange={(e) => {
              requestSetPreference('useTabs', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionTabs;
