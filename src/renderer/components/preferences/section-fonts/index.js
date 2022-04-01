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

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogCustomizeFonts } from '../../../state/dialog-customize-fonts/actions';

import DialogCustomizeFonts from './dialog-customize-fonts';

const SectionFonts = () => {
  const dispatch = useDispatch();

  const defaultFontSize = useSelector((state) => state.preferences.defaultFontSize);

  return (
    <>
      <List disablePadding dense>
        <ListItem>
          <ListItemText primary="Font size" />
          <Select
            value={defaultFontSize}
            onChange={(e) => {
              requestSetPreference('defaultFontSize', e.target.value);
              enqueueRequestRestartSnackbar();
            }}
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
            {[
              { value: 9, label: 'Very Small' },
              { value: 12, label: 'Small' },
              { value: 16, label: 'Medium (Recommended)' },
              { value: 20, label: 'Large' },
              { value: 24, label: 'Very Large' },
            ].map((item) => (
              <MenuItem key={item.value} dense value={item.value}>{item.label}</MenuItem>
            ))}
            {[9, 12, 16, 20, 24].indexOf(defaultFontSize) < 0 && (
              <MenuItem
                value={defaultFontSize}
                dense
              >
                Custom
              </MenuItem>
            )}
          </Select>
        </ListItem>
        <Divider />
        <ListItem button onClick={() => dispatch(openDialogCustomizeFonts())}>
          <ListItemText primary="Advanced font size settings" />
          <ChevronRightIcon color="action" />
        </ListItem>
      </List>
      <DialogCustomizeFonts />
    </>
  );
};

export default SectionFonts;
