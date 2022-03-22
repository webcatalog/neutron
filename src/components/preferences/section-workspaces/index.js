/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector } from 'react-redux';

import getWorkspacesAsList from '../../../helpers/get-workspaces-as-list';
import getWorkspaceName from '../../../helpers/get-workspace-name';
import getStaticGlobal from '../../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import {
  requestShowWorkspacePreferencesWindow,
  requestShowAddWorkspaceWindow,
  requestCreateWorkspace,
  requestRemoveWorkspace,
} from '../../../senders';

const SectionWorkspaces = () => {
  const workspaces = useSelector((state) => state.workspaces.workspaces);

  const appJson = getStaticGlobal('appJson');
  const workspacesList = getWorkspacesAsList(workspaces);

  return (
    <List disablePadding>
      {workspacesList.map((workspace, i) => (
        <React.Fragment key={workspace.id}>
          {i > 0 && <Divider />}
          <ListItem dense>
            <ListItemText primary={`${getWorkspaceName(workspace)} (#${i + 1})`} />
            <ListItemSecondaryAction>
              <Tooltip title={`Configure ${getWorkspaceFriendlyName()}`}>
                <IconButton
                  edge="end"
                  aria-label={`Configure ${getWorkspaceFriendlyName()}`}
                  onClick={() => requestShowWorkspacePreferencesWindow(workspace.id)}
                  size="large"
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Remove ${getWorkspaceFriendlyName()}`}>
                <IconButton
                  edge="end"
                  aria-label={`Remove ${getWorkspaceFriendlyName()}`}
                  onClick={() => requestRemoveWorkspace(workspace.id)}
                  size="large"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        </React.Fragment>
      ))}
      {appJson.url && (
        <>
          {workspacesList.length > 0 && <Divider />}
          <ListItem
            button
            onClick={() => requestCreateWorkspace()}
            dense={false}
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText primary={`Add ${appJson.name} ${getWorkspaceFriendlyName()}`} />
          </ListItem>
        </>
      )}
      {workspacesList.length > 0 && <Divider />}
      <ListItem
        button
        onClick={() => requestShowAddWorkspaceWindow()}
        dense={false}
      >
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary={appJson.url ? `Add Custom ${getWorkspaceFriendlyName()}` : `Add ${getWorkspaceFriendlyName()}`} />
      </ListItem>
    </List>
  );
};

export default SectionWorkspaces;
