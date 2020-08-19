import { combineReducers } from 'redux';

import {
  UPDATE_PAUSE_NOTIFICATIONS_INFO,
  UPDATE_SHOW_DATE_TIME_PICKER,
} from '../../constants/actions';

import { getPauseNotificationsInfo } from '../../senders';

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

const getInitialState = () => {
  const cachedState = window.localStorage.getItem('pauseNotificationsInfo');
  if (cachedState) {
    return JSON.parse(cachedState);
  }
  const latestState = getPauseNotificationsInfo();
  window.localStorage.setItem('pauseNotificationsInfo', JSON.stringify(latestState));
  return latestState;
};
const initialState = getInitialState();
const pauseNotificationsInfo = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_PAUSE_NOTIFICATIONS_INFO: {
      window.localStorage.setItem('pauseNotificationsInfo', JSON.stringify(action.pauseNotificationsInfo));
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
