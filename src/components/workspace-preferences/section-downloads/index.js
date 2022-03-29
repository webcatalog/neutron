/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { dialog, getCurrentWindow } from '@electron/remote';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { useDispatch, useSelector } from 'react-redux';

import isMas from '../../../helpers/is-mas';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const SectionDownloads = () => {
  const dispatch = useDispatch();

  const askForDownloadPath = useSelector((state) => state.preferences.askForDownloadPath);
  const downloadPath = useSelector((state) => state.preferences.downloadPath);
  const formAskForDownloadPath = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.askForDownloadPath,
  );
  const formDownloadPath = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.downloadPath,
  );

  return (
    <List disablePadding dense>
      {!isMas() && (
        <>
          <ListItem
            button
            onClick={() => {
              dialog.showOpenDialog(getCurrentWindow(), {
                properties: ['openDirectory'],
              })
                .then(({ canceled, filePaths }) => {
                  if (!canceled && filePaths && filePaths.length > 0) {
                    dispatch(updateForm({ preferences: { downloadPath: filePaths[0] } }));
                  }
                })
                .catch(console.log); // eslint-disable-line
            }}
          >
            <ListItemText
              primary="Download location"
              secondary={formDownloadPath != null ? formDownloadPath : `Use global preference (${downloadPath})`}
            />
            <ChevronRightIcon color="action" />
          </ListItem>
          <Divider />
        </>
      )}
      <ListItem>
        <ListItemText
          primary="Ask where to save each file before downloading"
          secondary={isMas() ? 'Otherwise, download files are always saved to ~/Downloads folder.' : null}
        />
        <Select
          value={formAskForDownloadPath != null ? formAskForDownloadPath : 'global'}
          onChange={(e) => dispatch(updateForm({
            preferences: {
              askForDownloadPath: e.target.value !== 'global' ? e.target.value : null,
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
            py: 1,
          }}
        >
          <MenuItem dense value="global">{`Use global preference (${askForDownloadPath ? 'Yes' : 'No'})`}</MenuItem>
          <MenuItem dense value>Yes</MenuItem>
          <MenuItem dense value={false}>No</MenuItem>
        </Select>
      </ListItem>
    </List>
  );
};

export default SectionDownloads;
