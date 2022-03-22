/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';

import ListItemTray from './list-item-tray';

const SectionTray = () => (
  <List disablePadding dense>
    <ListItemTray />
  </List>
);

export default SectionTray;
