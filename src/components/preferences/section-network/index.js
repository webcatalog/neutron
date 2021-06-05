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

import { open as openDialogProxy } from '../../../state/dialog-proxy/actions';

import DialogProxy from './dialog-proxy';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const Preferences = ({
  proxyMode,
  onOpenDialogProxy,
}) => (
  <>
    <List disablePadding dense>
      <ListItem button onClick={onOpenDialogProxy}>
        <ListItemText
          primary="Proxy"
          secondary={(() => {
            switch (proxyMode) {
              case 'fixed_servers': {
                return 'Using proxy server.';
              }
              case 'pac_script': {
                return 'Using PAC script (automatic proxy configuration script).';
              }
              case 'system': {
                return 'Using system proxy configurations.';
              }
              default: {
                return 'Not configured.';
              }
            }
          })()}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    </List>
    <DialogProxy />
  </>
);

Preferences.propTypes = {
  proxyMode: PropTypes.oneOf(['direct', 'fixed_servers', 'pac_script', 'system']).isRequired,
  onOpenDialogProxy: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  proxyMode: state.preferences.proxyMode,
});

const actionCreators = {
  openDialogProxy,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
