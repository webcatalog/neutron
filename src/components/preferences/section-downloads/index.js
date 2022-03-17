/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useSelector } from 'react-redux';

import isMas from '../../../helpers/is-mas';
import {
  requestSetPreference,
} from '../../../senders';

const getFileManagerName = () => {
  if (window.process.platform === 'darwin') return 'Finder';
  if (window.process.platform === 'win32') return 'File Explorer';
  return 'file manager';
};

const SectionDownloads = () => {
  const askForDownloadPath = useSelector((state) => state.preferences.askForDownloadPath);
  const downloadPath = useSelector((state) => state.preferences.downloadPath);
  // eslint-disable-next-line max-len
  const openFolderWhenDoneDownloading = useSelector((state) => state.preferences.openFolderWhenDoneDownloading);

  return (
    <List disablePadding dense>
      {!isMas() && (
        <>
          <ListItem
            button
            onClick={() => {
              window.remote.dialog.showOpenDialog(window.remote.getCurrentWindow(), {
                properties: ['openDirectory'],
              })
                .then(({ canceled, filePaths }) => {
                  if (!canceled && filePaths && filePaths.length > 0) {
                    requestSetPreference('downloadPath', filePaths[0]);
                  }
                })
                .catch(console.log); // eslint-disable-line
            }}
          >
            <ListItemText
              primary="Download location"
              secondary={downloadPath}
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
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={askForDownloadPath}
            onChange={(e) => {
              requestSetPreference('askForDownloadPath', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary={`Reveal the file in ${getFileManagerName()} when it is downloaded`} />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={openFolderWhenDoneDownloading}
            onChange={(e) => {
              requestSetPreference('openFolderWhenDoneDownloading', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionDownloads;
