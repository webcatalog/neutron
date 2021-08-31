/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';

import ListItemAuthStatus from '../../shared/list-item-auth-status';

const SectionPermissions = () => {
  if (window.process.platform !== 'darwin') {
    return null;
  }

  return (
    <List disablePadding dense>
      <ListItemAuthStatus authType="camera" />
      <Divider />
      <ListItemAuthStatus authType="microphone" />
    </List>
  );
};

export default SectionPermissions;
