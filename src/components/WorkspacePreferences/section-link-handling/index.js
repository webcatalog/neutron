/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';
import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';
import { open as openDialogExternalUrls } from '../../../state/dialog-external-urls/actions';

import DialogExternalUrls from '../../shared/dialog-external-urls';
import DialogInternalUrls from '../../shared/dialog-internal-urls';

const SectionLinkHandling = ({
  externalUrlRule,
  internalUrlRule,
  onOpenDialogExternalUrls,
  onOpenDialogInternalUrls,
  formExternalUrlRule,
  formInternalUrlRule,
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
};

SectionLinkHandling.propTypes = {
  internalUrlRule: PropTypes.string,
  externalUrlRule: PropTypes.string,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  onOpenDialogExternalUrls: PropTypes.func.isRequired,

  formInternalUrlRule: PropTypes.string,
  formExternalUrlRule: PropTypes.string,
};

const mapStateToProps = (state) => ({
  externalUrlRule: state.preferences.externalUrlRule,
  internalUrlRule: state.preferences.internalUrlRule,
  formAutoRefresh: state.dialogWorkspacePreferences.form.preferences.autoRefresh,
  formAutoRefreshInterval: state.dialogWorkspacePreferences.form.preferences.autoRefreshInterval,
  formExternalUrlRule: state.dialogWorkspacePreferences.form.preferences.externalUrlRule,
  formInternalUrlRule: state.dialogWorkspacePreferences.form.preferences.internalUrlRule,
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
);
