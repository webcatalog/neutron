import { combineReducers } from 'redux';

import {
  UPDATE_ADDRESS_BAR_INFO,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
  UPDATE_IS_DEFAULT_MAIL_CLIENT,
  UPDATE_IS_DEFAULT_WEB_BROWSER,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_TITLE,
} from '../../constants/actions';

import {
  getShouldUseDarkColors,
} from '../../senders';

const canGoBack = (state = false, action) => {
  switch (action.type) {
    case UPDATE_CAN_GO_BACK: return action.canGoBack;
    default: return state;
  }
};

const canGoForward = (state = false, action) => {
  switch (action.type) {
    case UPDATE_CAN_GO_FORWARD: return action.canGoForward;
    default: return state;
  }
};

const isFullScreen = (state = window.remote.getCurrentWindow().isFullScreen(), action) => {
  switch (action.type) {
    case UPDATE_IS_FULL_SCREEN: return action.isFullScreen;
    default: return state;
  }
};

const isDefaultMailClient = (state = window.remote.app.isDefaultProtocolClient('mailto'), action) => {
  switch (action.type) {
    case UPDATE_IS_DEFAULT_MAIL_CLIENT: return action.isDefaultMailClient;
    default: return state;
  }
};

const isDefaultWebBrowser = (state = window.remote.app.isDefaultProtocolClient('http'), action) => {
  switch (action.type) {
    case UPDATE_IS_DEFAULT_WEB_BROWSER: return action.isDefaultWebBrowser;
    default: return state;
  }
};

const shouldUseDarkColors = (state = getShouldUseDarkColors(), action) => {
  switch (action.type) {
    case UPDATE_SHOULD_USE_DARK_COLORS: return action.shouldUseDarkColors;
    default: return state;
  }
};

const address = (state = null, action) => {
  switch (action.type) {
    case UPDATE_ADDRESS_BAR_INFO: return action.address;
    default: return state;
  }
};

const addressEdited = (state = false, action) => {
  switch (action.type) {
    case UPDATE_ADDRESS_BAR_INFO: return action.edited;
    default: return state;
  }
};

const title = (state = '', action) => {
  switch (action.type) {
    case UPDATE_TITLE: return action.title;
    default: return state;
  }
};

export default combineReducers({
  address,
  addressEdited,
  canGoBack,
  canGoForward,
  isDefaultMailClient,
  isDefaultWebBrowser,
  isFullScreen,
  shouldUseDarkColors,
  title,
});
