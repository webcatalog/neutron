/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { ipcRenderer } from 'electron';

export const getReactInitialStateAsync = () => ipcRenderer.invoke('get-react-initial-state');
export const getMachineIdAsync = () => ipcRenderer.invoke('get-machine-id');

export const getAppLockStatusAsync = () => ipcRenderer.invoke('get-app-lock-status');
export const validateAppLockPasswordAsync = (inputPassword) => ipcRenderer.invoke('validate-app-lock-password', inputPassword);
export const deleteAppLockPasswordAsync = (inputPassword) => ipcRenderer.invoke('delete-app-lock-password', inputPassword);
export const setAppLockPasswordAsync = (inputPassword, newPassword) => ipcRenderer.invoke('set-app-lock-password', inputPassword, newPassword);
export const setAppLockTouchIdAsync = (inputPassword, useTouchId) => ipcRenderer.invoke('set-app-lock-touch-id', inputPassword, useTouchId);
export const isDefaultBrowserAsync = () => ipcRenderer.invoke('is-default-browser');
export const isDefaultMailClientAsync = () => ipcRenderer.invoke('is-default-mail-client');
export const isDefaultCalendarAppAsync = () => ipcRenderer.invoke('is-default-calendar-app');
export const getIapFormattedPriceAsync = (productIdentifier) => ipcRenderer.invoke('get-iap-formatted-price', productIdentifier);
export const getDesktopCapturerSourcesAsync = (options) => ipcRenderer.invoke('get-desktop-capturer-sources', options);

// Permission
export const getPermissionAuthTypeAsync = (authType) => ipcRenderer.invoke('get-permission-auth-status', authType);
export const askForPermissionAsync = (authType) => ipcRenderer.invoke('ask-for-permission', authType);

// Workspace
export const setWorkspacePictureAsync = (id, imgPath) => ipcRenderer.invoke('set-workspace-picture', id, imgPath);

// Password Manager
export const getAllCredentialsAsync = () => ipcRenderer.invoke('password-get-all-credentials');
export const saveCredentialAsync = (domain, username, password, id) => ipcRenderer.invoke('password-save-credential', domain, username, password, id);
export const deleteCredentialAsync = (id) => ipcRenderer.invoke('password-delete-credential', id);
