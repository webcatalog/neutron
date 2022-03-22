/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import { useSelector } from 'react-redux';

import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionTelemetry = () => {
  const sentry = useSelector((state) => state.preferences.sentry);
  const telemetry = useSelector((state) => state.preferences.telemetry);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Allow the app to send anonymous crash reports"
          secondary={isWebcatalog()
            ? 'This preference is managed by WebCatalog app.'
            : 'Help us quickly diagnose and fix bugs in the app.'}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={sentry}
            disabled={isWebcatalog()}
            onChange={(e) => {
              requestSetPreference('sentry', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
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
