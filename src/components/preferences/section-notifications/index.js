/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import semver from 'semver';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { TimePicker } from '@material-ui/pickers';

import connectComponent from '../../../helpers/connect-component';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';
import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  requestOpenInBrowser,
  requestSetPreference,
  requestShowNotification,
  requestShowNotificationsWindow,
} from '../../../senders';

const styles = (theme) => ({
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
});

const SectionNotifications = ({
  classes,
  pauseNotificationsBySchedule,
  pauseNotificationsByScheduleFrom,
  pauseNotificationsByScheduleTo,
  pauseNotificationsMuteAudio,
}) => {
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
          secondary={(() => {
            // only show this message on macOS Catalina 10.15 & above
            if (
              window.process.platform === 'darwin'
              && semver.gte(window.remote.process.getSystemVersion(), '10.15.0')
            ) {
              return (
                <>
                  <span>If notifications don&apos;t show up,</span>
                  <span> make sure you enable notifications in </span>
                  <b>
                    <span>macOS Preferences &gt; Notifications &gt; </span>
                    {appJson.name}
                  </b>
                  <span>.</span>
                </>
              );
            }
            return null;
          })()}
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
              <span>But for some web apps such as Gmail or Messenger</span>
              <span>, to receive notifications, you&apos;ll need to manually configure </span>
              <span>additional web app settings. </span>
              <span
                role="link"
                tabIndex={0}
                className={classes.link}
                onClick={() => requestOpenInBrowser(`https://help.webcatalog.app/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  requestOpenInBrowser(`https://help.webcatalog.app/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`);
                }}
              >
                Learn more
              </span>
              <span>.</span>
            </>
          )}
        />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          secondary={(
            <>
              <span>Due to technical limitations, web apps</span>
              <span> such as Google Calendar or Linear which</span>
              <span> require Web Push API won&apos;t be able to push notifications. </span>
              <span
                role="link"
                tabIndex={0}
                className={classes.link}
                onClick={() => requestOpenInBrowser(`https://docs.webcatalog.io/article/50-does-webcatalog-singlebox-and-clovery-support-all-w3c-web-standards?utm_source=${utmSource}`)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  requestOpenInBrowser(`https://docs.webcatalog.io/article/50-does-webcatalog-singlebox-and-clovery-support-all-w3c-web-standards?utm_source=${utmSource}`);
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

SectionNotifications.propTypes = {
  classes: PropTypes.object.isRequired,
  pauseNotificationsBySchedule: PropTypes.bool.isRequired,
  pauseNotificationsByScheduleFrom: PropTypes.string.isRequired,
  pauseNotificationsByScheduleTo: PropTypes.string.isRequired,
  pauseNotificationsMuteAudio: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  pauseNotificationsBySchedule: state.preferences.pauseNotificationsBySchedule,
  pauseNotificationsByScheduleFrom: state.preferences.pauseNotificationsByScheduleFrom,
  pauseNotificationsByScheduleTo: state.preferences.pauseNotificationsByScheduleTo,
  pauseNotificationsMuteAudio: state.preferences.pauseNotificationsMuteAudio,
});

export default connectComponent(
  SectionNotifications,
  mapStateToProps,
  null,
  styles,
);
