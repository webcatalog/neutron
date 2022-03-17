/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

import { useDispatch, useSelector } from 'react-redux';

import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const SectionAudioVideo = () => {
  const dispatch = useDispatch();
  // eslint-disable-next-line max-len
  const formDisableAudio = useSelector((state) => Boolean(state.dialogWorkspacePreferences.form.disableAudio));

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary={`Prevent the ${getWorkspaceFriendlyName().toLowerCase()} from playing sounds`}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={formDisableAudio}
            onChange={(e) => {
              dispatch(updateForm({
                disableAudio: e.target.checked,
              }));
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionAudioVideo;
