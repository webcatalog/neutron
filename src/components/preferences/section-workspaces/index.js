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

import AddIcon from '@material-ui/icons/Add';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

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
          <ListItem
            button
            onClick={() => requestShowWorkspacePreferencesWindow(workspace.id)}
            onContextMenu={(e) => {
              e.preventDefault();

              const template = [
                {
                  label: `Edit ${getWorkspaceFriendlyName()}`,
                  click: () => requestShowWorkspacePreferencesWindow(workspace.id),
                },
                {
                  label: `Remove ${getWorkspaceFriendlyName()}`,
                  click: () => requestRemoveWorkspace(workspace.id),
                },
              ];

              const menu = window.remote.Menu.buildFromTemplate(template);
              menu.popup(window.remote.getCurrentWindow());
            }}
            dense
          >
            <ListItemText primary={getWorkspaceName(workspace)} />
            <ChevronRightIcon color="action" />
          </ListItem>
        </React.Fragment>
      ))}
      {appJson.url && (
        <>
          <Divider />
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
      <Divider />
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
