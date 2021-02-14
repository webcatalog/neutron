/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_DIALOG_APP_LOCK,
  OPEN_DIALOG_APP_LOCK,
  CLOSE_DIALOG_APP_LOCK,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';
import getUtmSource from '../../helpers/get-utm-source';

import {
  deleteAppLockPasswordAsync,
  getAppLockStatusAsync,
  setAppLockPasswordAsync,
  setAppLockTouchIdAsync,
  validateAppLockPasswordAsync,
} from '../../invokers';

import { requestLockApp } from '../../senders';

export const open = () => (dispatch) => {
  Promise.resolve()
    .then(async () => {
      const status = await getAppLockStatusAsync();

      if (!status.supported && window.process.platform === 'linux') {
        window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
          type: 'info',
          message: 'To use this feature, please install libsecret.',
          buttons: ['OK', 'Learn More...'],
          cancelId: 0,
          defaultId: 0,
        })
          .then(({ response }) => {
            if (response === 1) {
              const utmSource = getUtmSource();
              window.remote.shell.openExternal(`https://help.webcatalog.app/article/29-what-are-the-requirements-to-use-app-lock-feature-on-linux?utm_source=${utmSource}`);
            }
          })
          .catch(console.log); // eslint-disable-line no-console
        return;
      }

      dispatch({
        type: OPEN_DIALOG_APP_LOCK,
        form: {
          password: '',
          currentPassword: '',
          useTouchId: status.useTouchId,
          hasPassword: status.hasPassword,
          requireCurrentPassword: status.hasPassword,
        },
      });
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

export const close = () => ({
  type: CLOSE_DIALOG_APP_LOCK,
});

const getValidationRules = (hasPassword) => ({
  password: {
    fieldName: 'Password',
    required: !hasPassword,
  },
});

export const updateForm = (changes) => (dispatch, getState) => {
  const { hasPassword } = getState().dialogAppLock.form;

  dispatch({
    type: UPDATE_DIALOG_APP_LOCK,
    changes: validate(changes, getValidationRules(hasPassword)),
  });
};

export const deletePassword = () => (dispatch, getState) => {
  const { form } = getState().dialogAppLock;

  Promise.resolve()
    .then(async () => {
      await deleteAppLockPasswordAsync(form.currentPassword);
      dispatch(close());
      return null;
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogAppLock;

  const validatedChanges = validate(form, getValidationRules(form.hasPassword));
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  Promise.resolve()
    .then(async () => {
      if (form.password) {
        await setAppLockPasswordAsync(form.currentPassword, form.password);
      }
      if (window.process.platform === 'darwin') {
        await setAppLockTouchIdAsync(form.currentPassword, form.useTouchId);
      }
      dispatch(close());
      requestLockApp();
      return null;
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

export const validateCurrentPassword = () => (dispatch, getState) => {
  const { form } = getState().dialogAppLock;
  validateAppLockPasswordAsync(form.currentPassword)
    .then((isValid) => {
      if (isValid) {
        dispatch(updateForm({ requireCurrentPassword: false }));
      } else {
        dispatch(updateForm({ currentPasswordError: 'Wrong password.' }));
      }
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};
