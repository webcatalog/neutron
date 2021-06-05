/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { DateTimePicker } from '@material-ui/pickers';

import {
  format, isTomorrow, isToday,
  addMinutes, addHours, addDays, addWeeks,
} from 'date-fns';

import connectComponent from '../../helpers/connect-component';

import {
  requestSetPreference,
  requestShowPreferencesWindow,
  requestShowNotification,
} from '../../senders';

// https://www.sketchappsources.com/free-source/2501-iphone-app-background-sketch-freebie-resource.html
import nightBackgroundPng from '../../images/night-background.png';

import { updateShowDateTimePicker } from '../../state/notifications/actions';

const styles = (theme) => ({
  hidden: {
    display: 'none',
  },
  pausingHeader: {
    background: `url(${nightBackgroundPng})`,
    height: 210,
    backgroundSize: 400,
    alignItems: 'flex-end',
  },
  pausingHeaderText: {
    color: theme.palette.common.white,
  },
});

const formatDate = (d) => {
  if (isToday(d)) {
    return format(d, 'p');
  }
  if (isTomorrow(d)) {
    return `tomorrow at ${format(d, 'p')}`;
  }
  return format(d, 'PPPp');
};

const DialogPauseNotifications = (props) => {
  const {
    classes,
    onUpdateShowDateTimePicker,
    pauseNotificationsInfo,
    showDateTimePicker,
  } = props;

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
    window.remote.getCurrentWindow().close();
  };

  const renderList = () => {
    if (shouldPauseNotifications) {
      return (
        <List
          dense
          disablePadding
        >
          <ListItem classes={{ root: classes.pausingHeader }}>
            <ListItemText
              primary={`Notifications paused until ${formatDate(new Date(pauseNotificationsInfo.tilDate))}.`}
              classes={{ primary: classes.pausingHeaderText }}
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
                window.remote.getCurrentWindow().close();
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
                    click: () => onUpdateShowDateTimePicker(true),
                  });
                  const menu = window.remote.Menu.buildFromTemplate(template);
                  menu.popup(window.remote.getCurrentWindow());
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
                window.remote.getCurrentWindow().close();
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
          onClick={() => onUpdateShowDateTimePicker(true)}
        >
          <ListItemText primary="Custom..." />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemText
            primary="Pause notifications by schedule..."
            onClick={() => {
              requestShowPreferencesWindow('notifications');
              window.remote.getCurrentWindow().close();
            }}
          />
        </ListItem>
      </List>
    );
  };

  return (
    <>
      {renderList()}
      <DateTimePicker
        value={new Date()}
        onChange={pauseNotif}
        label="Custom"
        open={showDateTimePicker}
        onOpen={() => onUpdateShowDateTimePicker(true)}
        onClose={() => onUpdateShowDateTimePicker(false)}
        className={classes.hidden}
        disablePast
        showTodayButton
      />
    </>
  );
};

DialogPauseNotifications.defaultProps = {
  pauseNotificationsInfo: null,
};

DialogPauseNotifications.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdateShowDateTimePicker: PropTypes.func.isRequired,
  pauseNotificationsInfo: PropTypes.object,
  showDateTimePicker: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  pauseNotificationsInfo: state.notifications.pauseNotificationsInfo,
  showDateTimePicker: state.notifications.showDateTimePicker,
});

const actionCreators = {
  updateShowDateTimePicker,
};

export default connectComponent(
  DialogPauseNotifications,
  mapStateToProps,
  actionCreators,
  styles,
);
