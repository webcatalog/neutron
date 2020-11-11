/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../helpers/connect-component';
import getWorkspacesAsList from '../../helpers/get-workspaces-as-list';
import getMailtoUrl from '../../helpers/get-mailto-url';

import { requestLoadUrl } from '../../senders';

const OpenUrlWith = ({ workspaces }) => {
  const appJson = window.remote.getGlobal('appJson');
  const incomingUrl = window.remote.getGlobal('incomingUrl');
  const isMailtoUrl = incomingUrl.startsWith('mailto:');

  const renderWorkspace = (workspace, i) => {
    if (isMailtoUrl && !getMailtoUrl(workspace.homeUrl || appJson.url)) return null;
    return (
      <ListItem
        button
        onClick={() => {
          const u = isMailtoUrl ? getMailtoUrl(workspace.homeUrl || appJson.url).replace('%s', incomingUrl) : incomingUrl;

          requestLoadUrl(u, workspace.id);
          window.remote.getCurrentWindow().close();
        }}
      >
        <ListItemText
          primary={workspace.name || `Workspace ${i + 1}`}
          secondary={`#${i + 1}`}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    );
  };

  return (
    <List dense>
      {getWorkspacesAsList(workspaces).map(renderWorkspace)}
    </List>
  );
};

OpenUrlWith.propTypes = {
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  workspaces: state.workspaces,
});

export default connectComponent(
  OpenUrlWith,
  mapStateToProps,
  null,
  null,
);
