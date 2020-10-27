import {
  UPDATE_APP_LOCK_FORM,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import {
  getPasswordAsync,
} from '../../invokers';

const getValidationRules = () => ({
  password: {
    fieldName: 'Password',
    required: true,
  },
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_APP_LOCK_FORM,
  changes: validate(changes, getValidationRules()),
});

export const validateForm = () => (dispatch, getState) => {
  const { form } = getState().appLock;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  getPasswordAsync(window.remote.getGlobal('appJson').id, 'app-lock-password')
    .then((password) => {
      if (!password || password === form.currentPassword) {
        dispatch(updateForm({ passwordError: 'Perfecto.' }));
      } else {
        dispatch(updateForm({ passwordError: 'Wrong password.' }));
      }
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};
