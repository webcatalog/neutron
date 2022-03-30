/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useDispatch, useSelector } from 'react-redux';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const SectionBadge = () => {
  const dispatch = useDispatch();

  const unreadCountBadge = useSelector((state) => state.preferences.unreadCountBadge);
  const formUnreadCountBadge = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.unreadCountBadge,
  );

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Show unread count badge"
        />
        <Select
          value={formUnreadCountBadge === false ? formUnreadCountBadge : 'global'}
          onChange={(e) => dispatch(updateForm({
            preferences: {
              unreadCountBadge: e.target.value !== 'global' ? e.target.value : null,
            },
          }))}
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
          }}
        >
          <MenuItem dense value="global">{`Use global preference (${unreadCountBadge ? 'Yes' : 'No'})`}</MenuItem>
          <MenuItem dense value={false}>No</MenuItem>
        </Select>
      </ListItem>
    </List>
  );
};

export default SectionBadge;
