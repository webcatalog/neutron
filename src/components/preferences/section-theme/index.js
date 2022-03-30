/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Avatar from '@mui/material/Avatar';

import { useSelector } from 'react-redux';

import ListItemIcon from '@mui/material/ListItemIcon';

import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import camelCaseToSentenceCase from '../../../helpers/camel-case-to-sentence-case';

import themeColors from '../../../constants/theme-colors';

import {
  requestSetPreference,
} from '../../../senders';

const SectionTheme = () => {
  const themeSource = useSelector((state) => state.preferences.themeSource);
  const themeColor = useSelector((state) => state.preferences.themeColor);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText primary="Theme" />
        <Select
          value={themeSource}
          onChange={(e) => requestSetPreference('themeSource', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          sx={{
            '& .MuiSelect-select': {
              py: 1,
              pr: 3.25,
              pl: 1.5,
            },
            borderRadius: 0.5,
            fontSize: '0.84375rem',
            my: 1,
          }}
        >
          <MenuItem dense value="system">System default</MenuItem>
          <MenuItem dense value="light">Light</MenuItem>
          <MenuItem dense value="dark">Dark</MenuItem>
        </Select>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Color" />
        <Select
          value={themeColor == null ? 'none' : themeColor}
          onChange={(e) => requestSetPreference('themeColor', e.target.value === 'none' ? null : e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          sx={{
            '& .MuiSelect-select': {
              py: 1,
              pr: 3.25,
              pl: 1.5,
            },
            borderRadius: 0.5,
            fontSize: '0.84375rem',
            my: 1,
          }}
        >
          <MenuItem dense value="none">None</MenuItem>
          <MenuItem dense value="auto">
            {`Matches with active ${getWorkspaceFriendlyName().toLowerCase()}'s color`}
          </MenuItem>
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
    </List>
  );
};

export default SectionTheme;
