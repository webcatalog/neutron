/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from '@mui/material';

import { useSelector } from 'react-redux';

import getKeytarVaultName from '../../../helpers/get-keytar-vault-name';
import {
  requestSetPreference,
} from '../../../senders';
import getStaticGlobal from '../../../helpers/get-static-global';

const SectionAutofill = () => {
  const passwordsAskToSave = useSelector((state) => state.preferences.passwordsAskToSave);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Ask to save logins and passwords for websites"
          secondary={getStaticGlobal('passwordManagerExtensionDetected')
            ? `The built-in autofill feature has been taken over by the '${getStaticGlobal('passwordManagerExtensionDetected')}'.`
            : `Passwords are stored encrypted locally on disk with the master key stored securely in ${getKeytarVaultName()}.`}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={getStaticGlobal('passwordManagerExtensionDetected') ? false : passwordsAskToSave}
            disabled={getStaticGlobal('passwordManagerExtensionDetected')}
            onChange={(e) => {
              requestSetPreference('passwordsAskToSave', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionAutofill;
