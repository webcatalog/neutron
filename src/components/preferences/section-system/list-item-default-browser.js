/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect, useCallback } from 'react';

import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import getStaticGlobal from '../../../helpers/get-static-global';
import isWindows10 from '../../../helpers/is-windows-10';

import { requestOpenInBrowser } from '../../../senders';

import { isDefaultBrowserAsync } from '../../../invokers';

const ListItemDefaultBrowser = () => {
  const appJson = getStaticGlobal('appJson');
  const [isDefault, setIsDefault] = useState(false);

  const recheckIsDefault = useCallback(
    () => {
      isDefaultBrowserAsync()
        .then((result) => {
          setIsDefault(result);
        });
    },
    [],
  );

  // recheck every 1s
  useEffect(() => {
    recheckIsDefault();
    const timer = setInterval(() => {
      recheckIsDefault();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [recheckIsDefault]);

  if (isDefault) {
    return (
      <ListItem>
        <ListItemText secondary={`${appJson.name} is your default browser.`} />
      </ListItem>
    );
  }

  const sharedListItemText = (
    <ListItemText primary="Default browser" secondary={`Make ${appJson.name} the default browser.`} />
  );

  // open ms-settings on Windows 10
  // as Windows 10 doesn't allow changing default app programmatically
  if (isWindows10()) {
    return (
      // https://docs.microsoft.com/en-us/windows/uwp/launch-resume/launch-settings-app
      <ListItem button onClick={() => requestOpenInBrowser('ms-settings:defaultapps')}>
        {sharedListItemText}
        <ChevronRightIcon color="action" />
      </ListItem>
    );
  }

  return (
    <ListItem>
      {sharedListItemText}
      <Button
        variant="outlined"
        size="small"
        color="default"
        onClick={() => {
          window.remote.app.setAsDefaultProtocolClient('http');
          window.remote.app.setAsDefaultProtocolClient('https');
          recheckIsDefault();
        }}
      >
        Make default
      </Button>
    </ListItem>
  );
};

export default connectComponent(
  ListItemDefaultBrowser,
  null,
  null,
  null,
);
