/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
export const getReactInitialStateAsync = () => window.ipcRenderer.invoke('get-react-initial-state');

export const getAppLockStatusAsync = () => window.ipcRenderer.invoke('get-app-lock-status');
export const validateAppLockPasswordAsync = (inputPassword) => window.ipcRenderer.invoke('validate-app-lock-password', inputPassword);
export const deleteAppLockPasswordAsync = (inputPassword) => window.ipcRenderer.invoke('delete-app-lock-password', inputPassword);
export const setAppLockPasswordAsync = (inputPassword, newPassword) => window.ipcRenderer.invoke('set-app-lock-password', inputPassword, newPassword);
export const setAppLockTouchIdAsync = (inputPassword, useTouchId) => window.ipcRenderer.invoke('set-app-lock-touch-id', inputPassword, useTouchId);
export const isDefaultBrowserAsync = () => window.ipcRenderer.invoke('is-default-browser');
export const isDefaultMailClientAsync = () => window.ipcRenderer.invoke('is-default-mail-client');
export const isDefaultCalendarAppAsync = () => window.ipcRenderer.invoke('is-default-calendar-app');
export const getIapFormattedPriceAsync = (productIdentifier) => window.ipcRenderer.invoke('get-iap-formatted-price', productIdentifier);
export const getExtensionFromProfileAsync = (browserId, profileDirName) => window.ipcRenderer.invoke('get-extensions-from-profile', browserId, profileDirName);
export const getExtensionSourcesAsync = () => window.ipcRenderer.invoke('get-extension-sources');

// Permission
export const getPermissionAuthTypeAsync = (authType) => window.ipcRenderer.invoke('get-permission-auth-status', authType);
export const askForPermissionAsync = (authType) => window.ipcRenderer.invoke('ask-for-permission', authType);

// Workspace
export const setWorkspacePictureAsync = (id, imgPath) => window.ipcRenderer.invoke('set-workspace-picture', id, imgPath);
