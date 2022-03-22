/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';

import { useSelector } from 'react-redux';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionLabs = () => {
  const enableExperimentalWebPlatformFeatures = useSelector(
    (state) => state.preferences.enableExperimentalWebPlatformFeatures,
  );

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText primary="Enable experimental web platform features" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={enableExperimentalWebPlatformFeatures}
            onChange={(e) => {
              requestSetPreference('enableExperimentalWebPlatformFeatures', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionLabs;
