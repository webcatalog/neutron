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

import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';
import { open as openDialogExternallUrls } from '../../../state/dialog-external-urls/actions';

import DialogExternalUrls from '../../shared/dialog-external-urls';
import DialogInternalUrls from '../../shared/dialog-internal-urls';
import ListItemOpenProtocolUrl from './list-item-open-protocol-url';

const SectionLinkHandling = ({
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
          secondary={internalUrlRule ? `/^${externalUrlRule}$/i` : 'Not set'}
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
};

const mapStateToProps = (state) => ({
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
