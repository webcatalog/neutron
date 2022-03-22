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

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import getStaticGlobal from '../../../helpers/get-static-global';

import {
  enqueueRequestRestartSnackbar,
  requestClearBrowsingData,
  requestSetPreference,
} from '../../../senders';

const SectionBrowsing = () => {
  const rememberLastPageVisited = useSelector((state) => state.preferences.rememberLastPageVisited);
  const shareWorkspaceBrowsingData = useSelector(
    (state) => state.preferences.shareWorkspaceBrowsingData,
  );

  const appJson = getStaticGlobal('appJson');

  return (
    <List disablePadding dense>
      <ListItem button onClick={requestClearBrowsingData}>
        <ListItemText primary="Clear browsing data" secondary="Clear cookies, cache, and more." />
        <ChevronRightIcon color="action" />
      </ListItem>
      {appJson.url && (
      <>
        <Divider />
        <ListItem>
          <ListItemText primary="Share browsing data between services & accounts" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={shareWorkspaceBrowsingData}
              onChange={(e) => {
                requestSetPreference('shareWorkspaceBrowsingData', e.target.checked);
                enqueueRequestRestartSnackbar();
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </>
      )}
      <Divider />
      <ListItem>
        <ListItemText primary="Remember last page visited" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={rememberLastPageVisited}
            onChange={(e) => {
              requestSetPreference('rememberLastPageVisited', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionBrowsing;
