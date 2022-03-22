/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import { useSelector } from 'react-redux';

import {
  requestSetPreference,
} from '../../../senders';

const SectionBadge = () => {
  const unreadCountBadge = useSelector((state) => state.preferences.unreadCountBadge);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText primary="Show unread count badge" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={unreadCountBadge}
            onChange={(e) => {
              requestSetPreference('unreadCountBadge', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionBadge;
