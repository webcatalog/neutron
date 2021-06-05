/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import isMas from '../../../helpers/is-mas';
import {
  requestSetPreference,
} from '../../../senders';

const getFileManagerName = () => {
  if (window.process.platform === 'darwin') return 'Finder';
  if (window.process.platform === 'win32') return 'File Explorer';
  return 'file manager';
};

const SectionDownloads = ({
  askForDownloadPath,
  downloadPath,
  openFolderWhenDoneDownloading,
}) => (
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
            primary="Download Location"
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

SectionDownloads.propTypes = {
  askForDownloadPath: PropTypes.bool.isRequired,
  downloadPath: PropTypes.string.isRequired,
  openFolderWhenDoneDownloading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  askForDownloadPath: state.preferences.askForDownloadPath,
  downloadPath: state.preferences.downloadPath,
  openFolderWhenDoneDownloading: state.preferences.openFolderWhenDoneDownloading,
});

export default connectComponent(
  SectionDownloads,
  mapStateToProps,
);
