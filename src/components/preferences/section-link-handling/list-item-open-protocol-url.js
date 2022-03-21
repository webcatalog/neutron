/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core';

import { useSelector } from 'react-redux';

import {
  requestSetPreference,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
    maxWidth: 'calc(100vw - 500px)',
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
}));

const ListItemOpenProtocolUrls = () => {
  const classes = useStyles();

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
        classes={{
          root: classes.select,
        }}
        className={classes.selectRoot}
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
