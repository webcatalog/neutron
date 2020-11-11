/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_PAUSE_NOTIFICATIONS_INFO,
  UPDATE_SHOW_DATE_TIME_PICKER,
} from '../../constants/actions';

const showDateTimePicker = (state = false, action) => {
  switch (action.type) {
    case UPDATE_SHOW_DATE_TIME_PICKER: {
      window.preventClosingWindow = action.showDateTimePicker;
      return action.showDateTimePicker;
    }
    default:
      return state;
  }
};

const pauseNotificationsInfo = (state = null, action) => {
  switch (action.type) {
    case UPDATE_PAUSE_NOTIFICATIONS_INFO: {
      return action.pauseNotificationsInfo;
    }
    default:
      return state;
  }
};

export default combineReducers({
  showDateTimePicker,
  pauseNotificationsInfo,
});
