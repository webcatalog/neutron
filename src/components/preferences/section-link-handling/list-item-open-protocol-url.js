/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useSelector } from 'react-redux';

import {
  requestSetPreference,
} from '../../../senders';

const ListItemOpenProtocolUrls = () => {
  const openProtocolUrlInNewWindow = useSelector(
    (state) => state.preferences.openProtocolUrlInNewWindow,
  );

  return (
    <ListItem>
      <ListItemText
        primary="Preferred behavior when opening links triggered by protocols"
      />
      <Select
        value={openProtocolUrlInNewWindow}
        onChange={(e) => requestSetPreference('openProtocolUrlInNewWindow', e.target.value)}
        variant="filled"
        disableUnderline
        margin="dense"
        sx={{
          borderRadius: 0.5,
          fontSize: '0.84375rem',
          my: 1,
          '& .MuiSelect-select': {
            py: 1,
            pr: 3.25,
            pl: 1.5,
          },
        }}
      >
        <MenuItem
          value="ask"
          dense
        >
          Always ask
        </MenuItem>
        <MenuItem
          value="mainWindow"
          dense
        >
          Open in main window
        </MenuItem>
        <MenuItem
          value="newWindow"
          dense
        >
          Open in new window
        </MenuItem>
      </Select>
    </ListItem>
  );
};

export default ListItemOpenProtocolUrls;
