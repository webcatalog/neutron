/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import { useSelector } from 'react-redux';

import {
  requestSetPreference,
} from '../../../senders';

const SectionPopupWindows = () => {
  const popupTitleBar = useSelector((state) => state.preferences.popupTitleBar);
  const popupFrameless = useSelector((state) => state.preferences.popupFrameless);

  return (
    <List disablePadding dense>
      {window.process.platform === 'darwin' && (
      <>
        <ListItem>
          <ListItemText
            primary="Make popup windows frameless"
            secondary={'Hide title bar and "traffic light" (red/yellow/green) buttons.'}
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={popupFrameless}
              onChange={(e) => {
                requestSetPreference('popupFrameless', e.target.checked);
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Show title bar on popup windows"
            secondary="Title bar shows you the title of the current page."
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={popupFrameless ? false : popupTitleBar}
              disabled={popupFrameless}
              onChange={(e) => {
                requestSetPreference('popupTitleBar', e.target.checked);
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </>
      )}
    </List>
  );
};

export default SectionPopupWindows;
