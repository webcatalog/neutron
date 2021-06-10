/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import isMas from '../../../helpers/is-mas';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const styles = (theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const SectionDownloads = ({
  askForDownloadPath,
  classes,
  downloadPath,
  onUpdateForm,
  formAskForDownloadPath,
  formDownloadPath,
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
                  onUpdateForm({ preferences: { downloadPath: filePaths[0] } });
                }
              })
              .catch(console.log); // eslint-disable-line
          }}
        >
          <ListItemText
            primary="Download Location"
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
        onChange={(e) => onUpdateForm({
          preferences: {
            askForDownloadPath: e.target.value !== 'global' ? e.target.value : null,
          },
        })}
        variant="filled"
        disableUnderline
        margin="dense"
        classes={{
          root: classes.select,
        }}
        className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
      >
        <MenuItem dense value="global">{`Use global preference (${askForDownloadPath ? 'Yes' : 'No'})`}</MenuItem>
        <MenuItem dense value>Yes</MenuItem>
        <MenuItem dense value={false}>No</MenuItem>
      </Select>
    </ListItem>
  </List>
);

SectionDownloads.defaultProps = {
  formAskForDownloadPath: null,
  formDownloadPath: null,
};

SectionDownloads.propTypes = {
  askForDownloadPath: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  downloadPath: PropTypes.string.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  formAskForDownloadPath: PropTypes.bool,
  formDownloadPath: PropTypes.string,
};

const mapStateToProps = (state) => ({
  askForDownloadPath: state.preferences.askForDownloadPath,
  downloadPath: state.preferences.downloadPath,
  formAskForDownloadPath: state.dialogWorkspacePreferences.form.preferences.askForDownloadPath,
  formDownloadPath: state.dialogWorkspacePreferences.form.preferences.downloadPath,
});

const actionCreators = {
  updateForm,
};

export default connectComponent(
  SectionDownloads,
  mapStateToProps,
  actionCreators,
  styles,
);
