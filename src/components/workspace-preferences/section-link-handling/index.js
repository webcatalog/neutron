/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';
import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';

import DialogInternalUrls from '../../shared/dialog-internal-urls';

const SectionLinkHandling = ({
  internalUrlRule,
  onOpenDialogInternalUrls,
  formInternalUrlRule,
}) => (
  <>
    <List disablePadding dense>
      <ListItem button onClick={onOpenDialogInternalUrls}>
        <ListItemText
          primary="Internal URLs"
          secondary={(() => {
            if (formInternalUrlRule != null) {
              return `/^${formInternalUrlRule}$/i`;
            }
            return `Global preference (${internalUrlRule ? `/^${internalUrlRule}$/i` : 'Not set'})`;
          })()}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    </List>
    <DialogInternalUrls />
  </>
);

SectionLinkHandling.defaultProps = {
  internalUrlRule: null,
  formInternalUrlRule: null,
};

SectionLinkHandling.propTypes = {
  internalUrlRule: PropTypes.string,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,

  formInternalUrlRule: PropTypes.string,
};

const mapStateToProps = (state) => ({
  internalUrlRule: state.preferences.internalUrlRule,
  formAutoRefresh: state.dialogWorkspacePreferences.form.preferences.autoRefresh,
  formAutoRefreshInterval: state.dialogWorkspacePreferences.form.preferences.autoRefreshInterval,
  formInternalUrlRule: state.dialogWorkspacePreferences.form.preferences.internalUrlRule,
});

const actionCreators = {
  updateForm,
  openDialogInternalUrls,
};

export default connectComponent(
  SectionLinkHandling,
  mapStateToProps,
  actionCreators,
);
