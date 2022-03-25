/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';

import { useSelector } from 'react-redux';

import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTelemetry = () => {
  const telemetry = useSelector((state) => state.preferences.telemetry);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Allow the app to send anonymous usage data"
          secondary={isWebcatalog()
            ? 'This preference is managed by WebCatalog app.'
            : 'Help us understand how to improve the product.'}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={telemetry}
            disabled={isWebcatalog()}
            onChange={(e) => {
              requestSetPreference('telemetry', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
};

export default SectionTelemetry;
