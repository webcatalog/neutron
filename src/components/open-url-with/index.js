/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';
import { getCurrentWindow } from '@electron/remote';

// import makeStyles from '@mui/styles/makeStyles';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import getWorkspacesAsList from '../../helpers/get-workspaces-as-list';
import getMailtoUrl from '../../helpers/get-mailto-url';
import getStaticGlobal from '../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import { requestLoadUrl } from '../../senders';

const OpenUrlWith = () => {
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const defaultOpenInNewWindow = useSelector((state) => state.preferences.openProtocolUrlInNewWindow === 'new-window');

  const appJson = getStaticGlobal('appJson');
  const incomingUrl = getStaticGlobal('incomingUrl');
  const isMailtoUrl = incomingUrl.startsWith('mailto:');

  const [openInNewWindow, setOpenInNewWindow] = useState(defaultOpenInNewWindow);

  const renderWorkspace = (workspace, i) => {
    if (isMailtoUrl && !getMailtoUrl(workspace.homeUrl || appJson.url)) return null;

    const fullName = (() => {
      if (workspace.name) return workspace.name;
      if (workspace.accountInfo) {
        if (workspace.accountInfo.name && workspace.accountInfo.email) {
          return `${workspace.accountInfo.name} (${workspace.accountInfo.email})`;
        }
        if (workspace.accountInfo.name) {
          return workspace.accountInfo.name;
        }
      }
      return `${getWorkspaceFriendlyName()} ${i + 1}`;
    })();

    return (
      <ListItem
        button
        onClick={() => {
          const u = isMailtoUrl ? getMailtoUrl(workspace.homeUrl || appJson.url).replace('%s', incomingUrl) : incomingUrl;

          requestLoadUrl(u, workspace.id, openInNewWindow);
          getCurrentWindow().close();
        }}
      >
        <ListItemText
          primary={fullName}
          secondary={`#${i + 1}`}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    );
  };

  return (
    <Box
      sx={{
        height: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <List
        dense
        sx={{
          flex: 1,
          overflow: 'auto',
        }}
        component="div"
      >
        {getWorkspacesAsList(workspaces).map(renderWorkspace)}
      </List>
      <Divider />
      <Box
        sx={{
          px: 2,
          userSelect: 'none',
        }}
      >
        <FormControlLabel
          control={(
            <Checkbox
              checked={openInNewWindow}
              onChange={(e) => setOpenInNewWindow(e.target.checked)}
              name="checkedB"
              color="primary"
            />
          )}
          label="Open in new window"
        />
      </Box>
    </Box>
  );
};

export default OpenUrlWith;
