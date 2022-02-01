/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';
import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';
import { open as openDialogExternalUrls } from '../../../state/dialog-external-urls/actions';

import DialogExternalUrls from '../../shared/dialog-external-urls';
import DialogInternalUrls from '../../shared/dialog-internal-urls';

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

const SectionLinkHandling = ({
  alwaysOpenInMainWindow,
  classes,
  externalUrlRule,
  formAlwaysOpenInMainWindow,
  formExternalUrlRule,
  formInternalUrlRule,
  internalUrlRule,
  onOpenDialogExternalUrls,
  onOpenDialogInternalUrls,
  onUpdateForm,
}) => (
  <>
    <List disablePadding dense>
      <ListItem button onClick={onOpenDialogExternalUrls}>
        <ListItemText
          primary="External URLs"
          secondary={(() => {
            if (formExternalUrlRule != null) {
              return `/^${formExternalUrlRule}$/i`;
            }
            return `Use global preference (${externalUrlRule ? `/^${externalUrlRule}$/i` : 'Not set'})`;
          })()}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem button onClick={onOpenDialogInternalUrls}>
        <ListItemText
          primary="Internal URLs"
          secondary={(() => {
            if (formInternalUrlRule != null) {
              return `/^${formInternalUrlRule}$/i`;
            }
            return `Use global preference (${internalUrlRule ? `/^${internalUrlRule}$/i` : 'Not set'})`;
          })()}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Always open internal URLs in main window"
          secondary="Otherwise, the app will open internal URLs in main window or popup windows depending on the context."
        />
        <Select
          value={formAlwaysOpenInMainWindow != null ? formAlwaysOpenInMainWindow : 'global'}
          onChange={(e) => {
            onUpdateForm({
              preferences: {
                alwaysOpenInMainWindow: e.target.value !== 'global' ? e.target.value : null,
              },
            });
          }}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
        >
          <MenuItem dense value="global">{`Use global preference (${alwaysOpenInMainWindow ? 'Yes' : 'No'})`}</MenuItem>
          <MenuItem dense value>Yes</MenuItem>
          <MenuItem dense value={false}>No</MenuItem>
        </Select>
      </ListItem>
    </List>
    <DialogInternalUrls />
    <DialogExternalUrls />
  </>
);

SectionLinkHandling.defaultProps = {
  externalUrlRule: null,
  formExternalUrlRule: null,
  internalUrlRule: null,
  formInternalUrlRule: null,
  formAlwaysOpenInMainWindow: null,
};

SectionLinkHandling.propTypes = {
  classes: PropTypes.object.isRequired,

  internalUrlRule: PropTypes.string,
  externalUrlRule: PropTypes.string,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  onOpenDialogExternalUrls: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,

  formInternalUrlRule: PropTypes.string,
  formExternalUrlRule: PropTypes.string,

  alwaysOpenInMainWindow: PropTypes.bool.isRequired,
  formAlwaysOpenInMainWindow: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  alwaysOpenInMainWindow: state.preferences.alwaysOpenInMainWindow,
  externalUrlRule: state.preferences.externalUrlRule,
  internalUrlRule: state.preferences.internalUrlRule,
  formAutoRefresh: state.dialogWorkspacePreferences.form.preferences.autoRefresh,
  formAutoRefreshInterval: state.dialogWorkspacePreferences.form.preferences.autoRefreshInterval,
  formExternalUrlRule: state.dialogWorkspacePreferences.form.preferences.externalUrlRule,
  formInternalUrlRule: state.dialogWorkspacePreferences.form.preferences.internalUrlRule,
  formAlwaysOpenInMainWindow: state.dialogWorkspacePreferences
    .form.preferences.alwaysOpenInMainWindow,
});

const actionCreators = {
  updateForm,
  openDialogInternalUrls,
  openDialogExternalUrls,
};

export default connectComponent(
  SectionLinkHandling,
  mapStateToProps,
  actionCreators,
  styles,
);
