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
import checkLicense from '../../../helpers/check-license';

import { open as openDialogAppLock } from '../../../state/dialog-app-lock/actions';

import DialogAppLock from './dialog-app-lock';

const SectionPrivacySecurity = ({
  onOpenDialogAppLock,
}) => {
  const canPromptTouchId = window.process.platform === 'darwin'
    && window.remote.systemPreferences.canPromptTouchID();

  return (
    <>
      <List disablePadding dense>
        <ListItem
          button
          onClick={() => {
            if (!checkLicense()) {
              return;
            }

            onOpenDialogAppLock();
          }}
        >
          <ListItemText
            primary="App Lock"
            secondary={`Protect this app from unauthorized access with password${canPromptTouchId ? ' or Touch ID' : ''}.`}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
      </List>
      <DialogAppLock />
    </>
  );
};

SectionPrivacySecurity.propTypes = {
  onOpenDialogAppLock: PropTypes.func.isRequired,
};

const actionCreators = {
  openDialogAppLock,
};

export default connectComponent(
  SectionPrivacySecurity,
  null,
  actionCreators,
);
