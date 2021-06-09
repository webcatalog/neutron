/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import { open as openDialogCodeInjection } from '../../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../../state/dialog-custom-user-agent/actions';
import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';
import { open as openDialogRefreshInterval } from '../../../state/dialog-refresh-interval/actions';
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

const SectionAudioVideo = ({
  muteApp,
  formDisableAudio,
  classes,
  onUpdateForm,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary={`Prevent the ${getWorkspaceFriendlyName().toLowerCase()} from playing sounds`}
      />
      <Select
        value={formDisableAudio === true ? formDisableAudio : 'global'}
        onChange={(e) => onUpdateForm({
          disableAudio: e.target.value !== 'global' ? e.target.value : null,
        })}
        variant="filled"
        disableUnderline
        margin="dense"
        classes={{
          root: classes.select,
        }}
        className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
      >
        <MenuItem dense value="global">{`Same as global (${muteApp ? 'Yes' : 'No'})`}</MenuItem>
        <MenuItem dense value>Yes</MenuItem>
      </Select>
    </ListItem>
  </List>
);

SectionAudioVideo.defaultProps = {
  formDisableAudio: null,
};

SectionAudioVideo.propTypes = {
  muteApp: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  formDisableAudio: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  muteApp: state.preferences.muteApp,
  formDisableAudio: state.dialogWorkspacePreferences.form.disableAudio,
});

const actionCreators = {
  openDialogCodeInjection,
  openDialogCustomUserAgent,
  openDialogInternalUrls,
  openDialogRefreshInterval,
  updateForm,
};

export default connectComponent(
  SectionAudioVideo,
  mapStateToProps,
  actionCreators,
  styles,
);
