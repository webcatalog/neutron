/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { Menu, getCurrentWindow } from '@electron/remote';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import DateTimePicker from '@mui/lab/DateTimePicker';
// import makeStyles from '@mui/styles/makeStyles';

import { useDispatch, useSelector } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import {
  format, isTomorrow, isToday,
  addMinutes, addHours, addDays, addWeeks,
} from 'date-fns';

import {
  requestSetPreference,
  requestShowPreferencesWindow,
  requestShowNotification,
} from '../../senders';

// https://www.sketchappsources.com/free-source/2501-iphone-app-background-sketch-freebie-resource.html
import nightBackgroundPng from '../../images/night-background.png';

import { updateShowDateTimePicker } from '../../state/notifications/actions';

const formatDate = (d) => {
  if (isToday(d)) {
    return format(d, 'p');
  }
  if (isTomorrow(d)) {
    return `tomorrow at ${format(d, 'p')}`;
  }
  return format(d, 'PPPp');
};

const DialogPauseNotifications = () => {
  // const classes = useStyles();
  const dispatch = useDispatch();

  const pauseNotificationsInfo = useSelector((state) => state.notifications.pauseNotificationsInfo);
  const showDateTimePicker = useSelector((state) => state.notifications.showDateTimePicker);

  const shouldPauseNotifications = pauseNotificationsInfo !== null;

  const quickShortcuts = [
    {
      name: '15 minutes',
      calcDate: () => addMinutes(new Date(), 15),
    },
    {
      name: '30 minutes',
      calcDate: () => addMinutes(new Date(), 30),
    },
    {
      name: '45 minutes',
      calcDate: () => addMinutes(new Date(), 45),
    },
    {
      name: '1 hour',
      calcDate: () => addHours(new Date(), 1),
    },
    {
      name: '2 hours',
      calcDate: () => addHours(new Date(), 2),
    },
    {
      name: '4 hours',
      calcDate: () => addHours(new Date(), 4),
    },
    {
      name: '6 hours',
      calcDate: () => addHours(new Date(), 6),
    },
    {
      name: '8 hours',
      calcDate: () => addHours(new Date(), 8),
    },
    {
      name: '10 hours',
      calcDate: () => addHours(new Date(), 8),
    },
    {
      name: '12 hours',
      calcDate: () => addHours(new Date(), 12),
    },
    {
      name: 'Until tomorrow',
      calcDate: () => addDays(new Date(), 1),
    },
    {
      name: 'Until next week',
      calcDate: () => addWeeks(new Date(), 1),
    },
  ];

  const pauseNotif = (tilDate) => {
    requestSetPreference('pauseNotifications', `pause:${tilDate.toString()}`);
    requestShowNotification({
      title: 'Notifications paused',
      body: `Notifications paused until ${formatDate(tilDate)}.`,
    });
    getCurrentWindow().close();
  };

  const renderList = () => {
    if (shouldPauseNotifications) {
      return (
        <List
          dense
          disablePadding
        >
          <ListItem sx={{
            background: `url(${nightBackgroundPng})`,
            height: 210,
            backgroundSize: 400,
            alignItems: 'flex-end',
          }}
          >
            <ListItemText
              primary={`Notifications paused until
              ${formatDate(new Date(pauseNotificationsInfo.tilDate))}.`}
              sx={{
                color: 'common.white',
              }}
            />
          </ListItem>
          <ListItem button>
            <ListItemText
              primary="Resume notifications"
              onClick={() => {
                if (pauseNotificationsInfo.reason === 'scheduled') {
                  requestSetPreference('pauseNotifications', `resume:${pauseNotificationsInfo.tilDate}`);
                } else if (pauseNotificationsInfo.schedule
                  && new Date() < new Date(pauseNotificationsInfo.schedule.to)) {
                  requestSetPreference('pauseNotifications', `resume:${pauseNotificationsInfo.schedule.to}`);
                } else {
                  requestSetPreference('pauseNotifications', null);
                }
                requestShowNotification({
                  title: 'Notifications resumed',
                  body: 'Notifications are now resumed.',
                });
                getCurrentWindow().close();
              }}
            />
          </ListItem>
          {pauseNotificationsInfo.reason !== 'scheduled' && (
            <>
              <Divider />
              <ListItem
                button
                onClick={() => {
                  const template = quickShortcuts.map((shortcut) => ({
                    label: shortcut.name,
                    click: () => pauseNotif(shortcut.calcDate()),
                  }));
                  template.push({
                    label: 'Custom',
                    click: () => dispatch(updateShowDateTimePicker(true)),
                  });
                  const menu = Menu.buildFromTemplate(template);
                  menu.popup({
                    window: getCurrentWindow(),
                  });
                }}
              >
                <ListItemText primary="Adjust time" />
                <ChevronRightIcon color="action" />
              </ListItem>
            </>
          )}
          <Divider />
          <ListItem button>
            <ListItemText
              primary={pauseNotificationsInfo.reason === 'scheduled' ? 'Adjust schedule...' : 'Pause notifications by schedule...'}
              onClick={() => {
                requestShowPreferencesWindow('notifications');
                getCurrentWindow().close();
              }}
            />
          </ListItem>
        </List>
      );
    }

    return (
      <List
        dense
        disablePadding
        subheader={<ListSubheader component="div">Pause notifications</ListSubheader>}
      >
        {quickShortcuts.map((shortcut) => (
          <ListItem
            button
            key={shortcut.name}
            onClick={() => pauseNotif(shortcut.calcDate())}
          >
            <ListItemText primary={shortcut.name} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={() => dispatch(updateShowDateTimePicker(true))}
        >
          <ListItemText primary="Custom..." />
        </ListItem>
        <Divider />
        <DateTimePicker
          value={new Date()}
          onChange={pauseNotif}
          label="Custom"
          open={showDateTimePicker}
          onOpen={() => dispatch(updateShowDateTimePicker(true))}
          onClose={() => dispatch(updateShowDateTimePicker(false))}
          disablePast
          showTodayButton
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={() => (
            <ListItem button>
              <ListItemText
                primary="Pause notifications by schedule..."
                onClick={() => {
                  requestShowPreferencesWindow('notifications');
                  getCurrentWindow().close();
                }}
              />
            </ListItem>
          )}
        />
      </List>
    );
  };

  return (
    <>
      {renderList()}
    </>
  );
};

export default DialogPauseNotifications;
