/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';

import connectComponent from '../../../helpers/connect-component';
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

const SectionWorkspaces = ({
  workspaces,
}) => {
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
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title={`Remove ${getWorkspaceFriendlyName()}`}>
                <IconButton
                  edge="end"
                  aria-label={`Remove ${getWorkspaceFriendlyName()}`}
                  onClick={() => requestRemoveWorkspace(workspace.id)}
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

SectionWorkspaces.propTypes = {
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  workspaces: state.workspaces.workspaces,
});

export default connectComponent(
  SectionWorkspaces,
  mapStateToProps,
);
