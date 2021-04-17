/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  UPDATE_ADDRESS_BAR_INFO,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_IS_MAXIMIZED,
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_TITLE,
  UPDATE_LOCKED,
} from '../../constants/actions';

const win = window.remote.getCurrentWindow();
const isMaximized = (state = win.isMaximized(), action) => {
  switch (action.type) {
    case UPDATE_IS_MAXIMIZED: return action.isMaximized;
    default: return state;
  }
};

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

const defaultIsFullScreen = window.remote.getCurrentWindow().isFullScreen();
const isFullScreen = (state = defaultIsFullScreen, action) => {
  switch (action.type) {
    case UPDATE_IS_FULL_SCREEN: return action.isFullScreen;
    default: return state;
  }
};

const shouldUseDarkColors = (state = false, action) => {
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

const locked = (state = false, action) => {
  switch (action.type) {
    case UPDATE_LOCKED: return action.locked;
    default: return state;
  }
};

export default combineReducers({
  address,
  addressEdited,
  canGoBack,
  canGoForward,
  isFullScreen,
  isMaximized,
  shouldUseDarkColors,
  title,
  locked,
});
