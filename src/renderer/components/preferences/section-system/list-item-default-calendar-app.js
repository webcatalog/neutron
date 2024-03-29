/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect, useCallback } from 'react';
import { app } from '@electron/remote';

import Button from '@mui/material/Button';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import getStaticGlobal from '../../../helpers/get-static-global';
import isWindows10 from '../../../helpers/is-windows-10';

import { requestOpenInBrowser } from '../../../senders';
import { isDefaultCalendarAppAsync } from '../../../invokers';

const ListItemDefaultCalendarApp = () => {
  const appJson = getStaticGlobal('appJson');
  const [isDefault, setIsDefault] = useState(false);

  const recheckIsDefault = useCallback(
    () => {
      isDefaultCalendarAppAsync()
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
        <ListItemText secondary={`${appJson.name} is your default calendar app.`} />
      </ListItem>
    );
  }

  // open ms-settings on Windows 10
  // as Windows 10 doesn't allow changing default app programmatically
  if (isWindows10()) {
    return (
      // https://docs.microsoft.com/en-us/windows/uwp/launch-resume/launch-settings-app
      <ListItem button onClick={() => requestOpenInBrowser('ms-settings:defaultapps')}>
        <ListItemText primary="Default calendar app" secondary={`Make ${appJson.name} the default calendar app.`} />
        <ChevronRightIcon color="action" />
      </ListItem>
    );
  }

  return (
    <ListItem>
      <ListItemText primary="Default calendar app" secondary={`Make ${appJson.name} the default calendar app.`} />
      <Button
        variant="outlined"
        size="small"
        onClick={() => {
          app.setAsDefaultProtocolClient('webcal');
          recheckIsDefault();
        }}
      >
        Make default
      </Button>
    </ListItem>
  );
};

export default ListItemDefaultCalendarApp;
