/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';

import { useDispatch, useSelector } from 'react-redux';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

import {
  enqueueRequestRestartSnackbar,
} from '../../../senders';

const SectionPrivacy = () => {
  const dispatch = useDispatch();

  const blockAds = useSelector((state) => state.preferences.blockAds);
  const formBlockAds = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.blockAds,
  );
  const blockJavascript = useSelector((state) => state.preferences.blockJavascript);
  const formBlockJavascript = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.blockJavascript,
  );

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Block ads &amp; trackers"
        />
        <Select
          value={formBlockAds != null ? formBlockAds : 'global'}
          onChange={(e) => {
            dispatch(updateForm({
              preferences: {
                blockAds: e.target.value !== 'global' ? e.target.value : null,
              },
            }));
            enqueueRequestRestartSnackbar();
          }}
          variant="filled"
          disableUnderline
          margin="dense"
          sx={{
            borderRadius: 0.5,
            fontSize: '0.84375rem',
            '& .MuiSelect-select': {
              py: 1,
              pr: 3.25,
              pl: 1.5,
            },
            py: 1,
          }}
        >
          <MenuItem dense value="global">{`Use global preference (${blockAds ? 'Yes' : 'No'})`}</MenuItem>
          <MenuItem dense value>Yes</MenuItem>
          <MenuItem dense value={false}>No</MenuItem>
        </Select>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary="Disable Javascript"
        />
        <Select
          value={formBlockJavascript != null ? formBlockJavascript : 'global'}
          onChange={(e) => {
            dispatch(updateForm({
              preferences: {
                blockJavascript: e.target.value !== 'global' ? e.target.value : null,
              },
            }));
            enqueueRequestRestartSnackbar();
          }}
          variant="filled"
          disableUnderline
          margin="dense"
          sx={{
            borderRadius: 0.5,
            fontSize: '0.84375rem',
            '& .MuiSelect-select': {
              py: 1,
              pr: 3.25,
              pl: 1.5,
            },
            py: 1,
          }}
        >
          <MenuItem dense value="global">{`Use global preference (${blockJavascript ? 'Yes' : 'No'})`}</MenuItem>
          <MenuItem dense value>Yes</MenuItem>
          <MenuItem dense value={false}>No</MenuItem>
        </Select>
      </ListItem>
    </List>
  );
};

export default SectionPrivacy;
