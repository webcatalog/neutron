/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useDispatch, useSelector } from 'react-redux';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import getWorkspaceName from '../../../helpers/get-workspace-name';

import { open as openDialogEditWorkspace } from '../../../state/dialog-edit-workspace/actions';

import ListItemIcon from './list-item-icon';
import ListItemColor from './list-item-color';
import DialogEditWorkspace from './dialog-edit-workspace';

const SectionWorkspace = () => {
  const dispatch = useDispatch();

  const homeUrl = useSelector((state) => state.dialogWorkspacePreferences.form.homeUrl);
  const name = useSelector((state) => getWorkspaceName(state.dialogWorkspacePreferences.form));

  return (
    <>
      <List disablePadding dense>
        <ListItemIcon />
        <Divider />
        <ListItem
          button
          onClick={() => dispatch(openDialogEditWorkspace())}
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
          onClick={() => dispatch(openDialogEditWorkspace())}
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
};

export default SectionWorkspace;
