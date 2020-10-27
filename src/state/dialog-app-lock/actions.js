import {
  UPDATE_DIALOG_APP_LOCK,
  OPEN_DIALOG_APP_LOCK,
  CLOSE_DIALOG_APP_LOCK,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import {
  getPasswordAsync,
  setPasswordAsync,
  deletePasswordAsync,
} from '../../invokers';

export const open = () => (dispatch) => {
  Promise.resolve()
    .then(async () => {
      const currentPassword = await getPasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-password');
      const useTouchId = window.process.platform === 'darwin'
        ? await getPasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-touch-id') === '1'
        : false;

      dispatch({
        type: OPEN_DIALOG_APP_LOCK,
        form: {
          password: '',
          currentPassword: '',
          useTouchId,
          requireCurrentPassword: Boolean(currentPassword),
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

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogAppLock;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  getPasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-password')
    .then(async (password) => {
      if (!password || password === form.currentPassword) {
        await setPasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-password', form.password);
        if (window.process.platform === 'darwin') {
          if (form.useTouchId) {
            await setPasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-touch-id', '1');
          } else {
            await deletePasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-touch-id');
          }
        }
        dispatch(close());
      }
      return null;
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};

export const validateCurrentPassword = () => (dispatch, getState) => {
  const { form } = getState().dialogAppLock;

  getPasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-password')
    .then((password) => {
      if (!password || password === form.currentPassword) {
        dispatch(updateForm({ requireCurrentPassword: false }));
      } else {
        dispatch(updateForm({ currentPasswordError: 'Wrong password.' }));
      }
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};
