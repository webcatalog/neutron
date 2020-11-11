/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_ADDRESS_BAR_INFO,
  UPDATE_CAN_GO_BACK,
  UPDATE_CAN_GO_FORWARD,
  UPDATE_IS_DEFAULT_MAIL_CLIENT,
  UPDATE_IS_DEFAULT_WEB_BROWSER,
  UPDATE_IS_FULL_SCREEN,
  UPDATE_IS_MAXIMIZED,
  UPDATE_SHOULD_USE_DARK_COLORS,
  UPDATE_TITLE,
  UPDATE_LOCKED,
} from '../../constants/actions';

export const updateIsMaximized = (isMaximized) => ({
  type: UPDATE_IS_MAXIMIZED,
  isMaximized,
});

export const updateCanGoBack = (canGoBack) => ({
  type: UPDATE_CAN_GO_BACK,
  canGoBack,
});

export const updateCanGoForward = (canGoForward) => ({
  type: UPDATE_CAN_GO_FORWARD,
  canGoForward,
});

export const updateIsFullScreen = (isFullScreen) => ({
  type: UPDATE_IS_FULL_SCREEN,
  isFullScreen,
});

export const updateIsDefaultMailClient = (isDefaultMailClient) => ({
  type: UPDATE_IS_DEFAULT_MAIL_CLIENT,
  isDefaultMailClient,
});

export const updateIsDefaultWebBrowser = (isDefaultWebBrowser) => ({
  type: UPDATE_IS_DEFAULT_WEB_BROWSER,
  isDefaultWebBrowser,
});

export const updateShouldUseDarkColors = (shouldUseDarkColors) => ({
  type: UPDATE_SHOULD_USE_DARK_COLORS,
  shouldUseDarkColors,
});

export const updateAddressBarInfo = (address, edited) => ({
  type: UPDATE_ADDRESS_BAR_INFO,
  address,
  edited,
});

export const updateTitle = (title) => ({
  type: UPDATE_TITLE,
  title,
});

export const updateLocked = (locked) => ({
  type: UPDATE_LOCKED,
  locked,
});
