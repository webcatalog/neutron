/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';

import ListItemIcon from '@mui/material/ListItemIcon';

import { useSelector, useDispatch } from 'react-redux';

import camelCaseToSentenceCase from '../../../helpers/camel-case-to-sentence-case';

import themeColors from '../../../constants/theme-colors';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const ListItemColor = () => {
  const dispatch = useDispatch();

  const color = useSelector((state) => state.dialogWorkspacePreferences.form.preferences.color);

  return (
    <ListItem>
      <ListItemText primary="Color" />
      <Select
        value={color == null ? 'none' : color}
        onChange={(e) => dispatch(updateForm({
          preferences: {
            color: e.target.value === 'none' ? null : e.target.value,
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
        // renderValue={(value) => camelCaseToSentenceCase(value)}
      >
        <MenuItem dense value="none">None</MenuItem>
        {Object.keys(themeColors).map((val) => (
          <MenuItem dense value={val} key={val}>
            <ListItemIcon>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                }}
                style={{ backgroundColor: themeColors[val][600] }}
              >
                {' '}
              </Avatar>
            </ListItemIcon>
            <ListItemText primary={camelCaseToSentenceCase(val)} />
          </MenuItem>
        ))}
      </Select>
    </ListItem>
  );
};

export default ListItemColor;
