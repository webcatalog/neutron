/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { useSelector } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTab = () => {
  const tabsEnable = useSelector((state) => state.preferences.tabsEnable ?? true);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Enable tabs"
          secondary="Enable tabs feature for app."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            defaultChecked={tabsEnable}
            onChange={(e) => {
              requestSetPreference('tabsEnable', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionTab;
