import {
  UPDATE_DIALOG_APP_LOCK,
  OPEN_DIALOG_APP_LOCK,
  CLOSE_DIALOG_APP_LOCK,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

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

const getValidationRules = () => ({
  password: {
    fieldName: 'Password',
    required: true,
  },
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_DIALOG_APP_LOCK,
  changes: validate(changes, getValidationRules()),
});

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

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  Promise.resolve()
    .then(async () => {
      await setAppLockPasswordAsync(form.currentPassword, form.password);
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
