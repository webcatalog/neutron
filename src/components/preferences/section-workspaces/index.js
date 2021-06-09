/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import getWorkspacesAsList from '../../../helpers/get-workspaces-as-list';
import {
  requestShowWorkspacePreferencesWindow,
} from '../../../senders';

const SectionWorkspaces = ({
  workspaces,
}) => {
  const workspacesList = getWorkspacesAsList(workspaces);

  return (
    <List disablePadding dense>
      {workspacesList.map((workspace) => (
        <ListItem
          key={workspace.id}
          button
          onClick={() => requestShowWorkspacePreferencesWindow(workspace.id)}
        >
          <ListItemText primary={workspacesList[0].name} />
          <ChevronRightIcon color="action" />
        </ListItem>
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
