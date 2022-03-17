/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useDispatch, useSelector } from 'react-redux';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import { open as openDialogProxy } from '../../../state/dialog-proxy/actions';

import DialogProxy from '../../shared/dialog-proxy';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});
const Preferences = () => {
  const dispatch = useDispatch();

  const proxyMode = useSelector((state) => state.preferences.proxyMode);

  return (
    <>
      <List disablePadding dense>
        <ListItem button onClick={dispatch(openDialogProxy)}>
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
};

export default connectComponent(
  Preferences,
  styles,
);
