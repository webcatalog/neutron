/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { useSelector, useDispatch } from 'react-redux';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { open as openDialogProxy } from '../../../state/dialog-proxy/actions';

import DialogProxy from '../../shared/dialog-proxy';

const getProxyModeDesc = (proxyMode) => {
  switch (proxyMode) {
    case 'fixed_servers': {
      return 'Using proxy server';
    }
    case 'pac_script': {
      return 'Using PAC script (automatic proxy configuration script)';
    }
    case 'system': {
      return 'Using system proxy configurations';
    }
    default: {
      return 'Do not use proxy';
    }
  }
};

const SectionNetwork = () => {
  const dispatch = useDispatch();

  const proxyMode = useSelector((state) => state.preferences.proxyMode);
  const formProxyMode = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.proxyMode,
  );

  return (
    <>
      <List disablePadding dense>
        <ListItem button onClick={() => dispatch(openDialogProxy())}>
          <ListItemText
            primary="Proxy"
            secondary={(() => {
              if (formProxyMode == null) {
                return `Use global preference (${getProxyModeDesc(proxyMode)}).`;
              }

              return `${getProxyModeDesc(formProxyMode)}.`;
            })()}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
      </List>
      <DialogProxy />
    </>
  );
};

export default SectionNetwork;
