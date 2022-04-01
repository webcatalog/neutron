/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import semver from 'semver';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';

import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { TimePicker } from '@mui/lab';

import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';
import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  requestOpenInBrowser,
  requestSetPreference,
  requestShowNotification,
  requestShowNotificationsWindow,
} from '../../../senders';

const SectionNotifications = () => {
  const pauseNotificationsBySchedule = useSelector(
    (state) => state.preferences.pauseNotificationsBySchedule,
  );
  const pauseNotificationsByScheduleFrom = useSelector(
    (state) => state.preferences.pauseNotificationsByScheduleFrom,
  );
  const pauseNotificationsByScheduleTo = useSelector(
    (state) => state.preferences.pauseNotificationsByScheduleTo,
  );
  const pauseNotificationsMuteAudio = useSelector(
    (state) => state.preferences.pauseNotificationsMuteAudio,
  );

  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <List disablePadding dense>
      <ListItem button onClick={requestShowNotificationsWindow}>
        <ListItemText primary="Control notifications" />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText>
          Automatically disable notifications by schedule:
          <Box
            sx={{
              my: 1,
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <TimePicker
              autoOk={false}
              label="from"
              value={new Date(pauseNotificationsByScheduleFrom)}
              onChange={(d) => requestSetPreference('pauseNotificationsByScheduleFrom', d.toString())}
              onClose={() => { window.preventClosingWindow = false; }}
              onOpen={() => { window.preventClosingWindow = true; }}
              disabled={!pauseNotificationsBySchedule}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => <TextField {...params} />}
            />
            <TimePicker
              autoOk={false}
              label="to"
              value={new Date(pauseNotificationsByScheduleTo)}
              onChange={(d) => requestSetPreference('pauseNotificationsByScheduleTo', d.toString())}
              onClose={() => { window.preventClosingWindow = false; }}
              onOpen={() => { window.preventClosingWindow = true; }}
              disabled={!pauseNotificationsBySchedule}
              // eslint-disable-next-line react/jsx-props-no-spreading
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
          (
          {window.Intl.DateTimeFormat().resolvedOptions().timeZone}
          )
        </ListItemText>
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={pauseNotificationsBySchedule}
            onChange={(e) => {
              requestSetPreference('pauseNotificationsBySchedule', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Mute audio when notifications are paused" />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={pauseNotificationsMuteAudio}
            onChange={(e) => {
              requestSetPreference('pauseNotificationsMuteAudio', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem
        button
        onClick={() => {
          requestShowNotification({
            title: 'Test notifications',
            body: 'It is working!',
          });
        }}
      >
        <ListItemText
          primary="Test notifications"
           // only show this message on macOS Catalina 10.15 & above
          secondary={(
            window.process.platform === 'darwin'
            && semver.gte(process.getSystemVersion(), '10.15.0')
          ) && ((
            <>
              <span>If notifications don&apos;t show up,</span>
              <span> make sure you enable notifications in </span>
              <b>
                <span>macOS Preferences &gt; Notifications &gt; </span>
                {appJson.name}
              </b>
              <span>.</span>
            </>
          ))}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          secondary={(
            <>
              {isWebcatalog() ? 'WebCatalog' : appJson.name}
              <span> supports notifications out of the box. </span>
              <span>But to receive notifications</span>
              <span>, you might need to manually configure </span>
              <span>additional web app settings. </span>
              <span
                role="link"
                tabIndex={0}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 500,
                  outline: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                  '&:focus': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => requestOpenInBrowser(`https://docs.webcatalog.io/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  requestOpenInBrowser(`https://docs.webcatalog.io/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`);
                }}
              >
                Learn more
              </span>
              <span>.</span>
            </>
          )}
        />
      </ListItem>
    </List>
  );
};

export default SectionNotifications;
