/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceName from '../../../helpers/get-workspace-name';

import { open as openDialogEditWorkspace } from '../../../state/dialog-edit-workspace/actions';

import ListItemIcon from './list-item-icon';
import ListItemColor from './list-item-color';
import DialogEditWorkspace from './dialog-edit-workspace';

const SectionWorkspace = ({
  name,
  homeUrl,
  onOpenDialogEditWorkspace,
}) => (
  <>
    <List disablePadding dense>
      <ListItemIcon />
      <Divider />
      <ListItem
        button
        onClick={() => onOpenDialogEditWorkspace()}
      >
        <ListItemText
          primary="Name"
          secondary={name}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem
        button
        onClick={() => onOpenDialogEditWorkspace()}
      >
        <ListItemText
          primary="Home URL"
          secondary={homeUrl}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItemColor />
    </List>
    <DialogEditWorkspace />
  </>
);

SectionWorkspace.defaultProps = {
  name: '',
  homeUrl: '',
};

SectionWorkspace.propTypes = {
  name: PropTypes.string,
  homeUrl: PropTypes.string,
  onOpenDialogEditWorkspace: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  homeUrl: state.dialogWorkspacePreferences.form.homeUrl,
  name: getWorkspaceName(state.dialogWorkspacePreferences.form),
});

const actionCreators = {
  openDialogEditWorkspace,
};

export default connectComponent(
  SectionWorkspace,
  mapStateToProps,
  actionCreators,
);
