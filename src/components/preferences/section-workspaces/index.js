/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';
import getWorkspacesAsList from '../../../helpers/get-workspaces-as-list';
import getWorkspaceName from '../../../helpers/get-workspace-name';
import {
  requestShowWorkspacePreferencesWindow,
} from '../../../senders';

const SectionWorkspaces = ({
  workspaces,
}) => {
  const workspacesList = getWorkspacesAsList(workspaces);

  return (
    <List disablePadding dense>
      {workspacesList.map((workspace, i) => (
        <React.Fragment key={workspace.id}>
          {i > 0 && <Divider />}
          <ListItem
            button
            onClick={() => requestShowWorkspacePreferencesWindow(workspace.id)}
          >
            <ListItemText primary={getWorkspaceName(workspace)} />
            <ChevronRightIcon color="action" />
          </ListItem>
        </React.Fragment>
      ))}
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
