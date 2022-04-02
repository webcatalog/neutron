/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import {
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch,
} from '@material-ui/core';

import connectComponent from '../../../helpers/connect-component';
import getKeytarVaultName from '../../../helpers/get-keytar-vault-name';
import {
  requestSetPreference,
} from '../../../senders';

const SectionAutofill = ({ passwordsAskToSave }) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary="Ask to save logins and passwords for websites"
        secondary={`Passwords are stored encrypted locally on disk with the master key stored securely in ${getKeytarVaultName()}.`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={passwordsAskToSave}
          onChange={(e) => {
            requestSetPreference('passwordsAskToSave', e.target.checked);
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionAutofill.propTypes = {
  passwordsAskToSave: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  passwordsAskToSave: state.preferences.passwordsAskToSave,
});

export default connectComponent(
  SectionAutofill,
  mapStateToProps,
);
