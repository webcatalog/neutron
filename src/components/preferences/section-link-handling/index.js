/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';
import { open as openDialogExternallUrls } from '../../../state/dialog-external-urls/actions';

import DialogExternalUrls from '../../shared/dialog-external-urls';
import DialogInternalUrls from '../../shared/dialog-internal-urls';
import ListItemOpenProtocolUrl from './list-item-open-protocol-url';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionLinkHandling = ({
  alwaysOpenInMainWindow,
  internalUrlRule,
  externalUrlRule,
  onOpenDialogExternallUrls,
  onOpenDialogInternalUrls,
}) => (
  <>
    <List disablePadding dense>
      <ListItemOpenProtocolUrl />
      <Divider />
      <ListItem button onClick={onOpenDialogExternallUrls}>
        <ListItemText
          primary="External URLs"
          secondary={externalUrlRule ? `/^${externalUrlRule}$/i` : 'Not set'}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem button onClick={onOpenDialogInternalUrls}>
        <ListItemText
          primary="Internal URLs"
          secondary={internalUrlRule ? `/^${internalUrlRule}$/i` : 'Not set'}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Always open internal URLs in main window"
          secondary="Otherwise, the app will open internal URLs in main window or popup windows depending on the context."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={alwaysOpenInMainWindow}
            onChange={(e) => {
              requestSetPreference('alwaysOpenInMainWindow', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
    <DialogInternalUrls />
    <DialogExternalUrls />
  </>
);

SectionLinkHandling.defaultProps = {
  externalUrlRule: null,
  internalUrlRule: null,
};

SectionLinkHandling.propTypes = {
  externalUrlRule: PropTypes.string,
  internalUrlRule: PropTypes.string,
  onOpenDialogExternallUrls: PropTypes.func.isRequired,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  alwaysOpenInMainWindow: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  alwaysOpenInMainWindow: state.preferences.alwaysOpenInMainWindow,
  autoRefresh: state.preferences.autoRefresh,
  autoRefreshInterval: state.preferences.autoRefreshInterval,
  autoRefreshOnlyWhenInactive: state.preferences.autoRefreshOnlyWhenInactive,
  defaultFontSize: state.preferences.defaultFontSize,
  externalUrlRule: state.preferences.externalUrlRule,
  internalUrlRule: state.preferences.internalUrlRule,
});

const actionCreators = {
  openDialogExternallUrls,
  openDialogInternalUrls,
};

export default connectComponent(
  SectionLinkHandling,
  mapStateToProps,
  actionCreators,
);
