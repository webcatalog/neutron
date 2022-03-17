/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import semver from 'semver';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core';

import { useSelector } from 'react-redux';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { TimePicker } from '@material-ui/pickers';

import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';
import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  requestOpenInBrowser,
  requestSetPreference,
  requestShowNotification,
  requestShowNotificationsWindow,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  timePickerContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
  },
  link: {
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus': {
      textDecoration: 'underline',
    },
  },
}));

const SectionNotifications = () => {
  const classes = useStyles();

  // eslint-disable-next-line max-len
  const pauseNotificationsBySchedule = useSelector((state) => state.preferences.pauseNotificationsBySchedule);
  // eslint-disable-next-line max-len
  const pauseNotificationsByScheduleFrom = useSelector((state) => state.preferences.pauseNotificationsByScheduleFrom);
  // eslint-disable-next-line max-len
  const pauseNotificationsByScheduleTo = useSelector((state) => state.preferences.pauseNotificationsByScheduleTo);
  // eslint-disable-next-line max-len
  const pauseNotificationsMuteAudio = useSelector((state) => state.preferences.pauseNotificationsMuteAudio);

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
          <div className={classes.timePickerContainer}>
            <TimePicker
              autoOk={false}
              label="from"
              value={new Date(pauseNotificationsByScheduleFrom)}
              onChange={(d) => requestSetPreference('pauseNotificationsByScheduleFrom', d.toString())}
              onClose={() => { window.preventClosingWindow = false; }}
              onOpen={() => { window.preventClosingWindow = true; }}
              disabled={!pauseNotificationsBySchedule}
            />
            <TimePicker
              autoOk={false}
              label="to"
              value={new Date(pauseNotificationsByScheduleTo)}
              onChange={(d) => requestSetPreference('pauseNotificationsByScheduleTo', d.toString())}
              onClose={() => { window.preventClosingWindow = false; }}
              onOpen={() => { window.preventClosingWindow = true; }}
              disabled={!pauseNotificationsBySchedule}
            />
          </div>
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
            && semver.gte(window.remote.process.getSystemVersion(), '10.15.0')
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
                className={classes.link}
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
