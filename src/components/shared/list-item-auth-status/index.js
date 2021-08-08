/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import {
  getPermissionAuthTypeAsync,
  askForPermissionAsync,
} from '../../../invokers';

import {
  requestOpenInBrowser,
} from '../../../senders';

const ListItemAuthStatus = ({ authType }) => {
  const [authorized, setAuthorized] = useState(false); // authorized or denied

  const recheckAuthorized = useCallback(
    () => {
      getPermissionAuthTypeAsync(authType)
        .then((status) => {
          setAuthorized(status === 'authorized');
        });
    },
    [authType],
  );

  // recheck every 1s
  useEffect(() => {
    recheckAuthorized();
    const timer = setInterval(() => {
      recheckAuthorized();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [recheckAuthorized]);

  return (
    <ListItem>
      <ListItemText
        primary={`Allow access to ${authType}`}
        secondary={`The app is currently ${authorized ? 'authorized' : 'not authorized'} to access this device's ${authType}.`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={authorized}
          onChange={() => {
            if (authType === 'location') {
              // call geolocation api so the app is added to the list in macOS prefs
              if (!authorized && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition(() => {}, () => {});
              }
              requestOpenInBrowser('x-apple.systempreferences:com.apple.preference.security?Privacy_LocationServices');
              return;
            }

            if (!authorized) {
              askForPermissionAsync(authType)
                .then((result) => {
                  setAuthorized(result === 'authorized');
                })
                .catch(() => {});
            } else if (authType === 'camera') {
              requestOpenInBrowser('x-apple.systempreferences:com.apple.preference.security?Privacy_Camera');
            } else if (authType === 'microphone') {
              requestOpenInBrowser('x-apple.systempreferences:com.apple.preference.security?Privacy_Microphone');
            }
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
};

ListItemAuthStatus.propTypes = {
  authType: PropTypes.oneOf(['camera', 'microphone', 'location']).isRequired,
};

export default ListItemAuthStatus;
