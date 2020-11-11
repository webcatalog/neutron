/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_PAUSE_NOTIFICATIONS_INFO,
  UPDATE_SHOW_DATE_TIME_PICKER,
} from '../../constants/actions';

export const updateShowDateTimePicker = (showDateTimePicker) => ({
  type: UPDATE_SHOW_DATE_TIME_PICKER,
  showDateTimePicker,
});

export const updatePauseNotificationsInfo = (pauseNotificationsInfo) => ({
  type: UPDATE_PAUSE_NOTIFICATIONS_INFO,
  pauseNotificationsInfo,
});
