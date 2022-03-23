/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import { useSelector } from 'react-redux';

import {
  requestSetPreference,
} from '../../../senders';

import searchEngines from '../../../constants/search-engines';

const SectionSearch = () => {
  const searchEngine = useSelector((state) => state.preferences.searchEngine);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Search engine"
          secondary="Search engine used in the address bar and other contexts."
        />
        <Select
          value={searchEngine}
          onChange={(e) => requestSetPreference('searchEngine', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          sx={{
            borderRadius: 0.5,
            fontSize: '0.84375rem',
            '& .MuiSelect-select': {
              py: 1, pl: 1.5, pr: 26,
            },
          }}
        >
          {Object.keys(searchEngines).map((optKey) => {
            const opt = searchEngines[optKey];
            return (
              <MenuItem
                key={optKey}
                value={optKey}
                dense
              >
                {opt.name}
              </MenuItem>
            );
          })}
        </Select>
      </ListItem>
    </List>
  );
};

export default SectionSearch;
