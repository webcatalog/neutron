import {
  UPDATE_APP_LOCK_FORM,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import {
  validateAppLockPasswordAsync,
} from '../../invokers';

import {
  requestUnlockApp,
} from '../../senders';

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

  validateAppLockPasswordAsync(form.password)
    .then((isValid) => {
      if (isValid) {
        requestUnlockApp(form.password);
        dispatch(updateForm({ password: '' }));
      } else {
        dispatch(updateForm({ passwordError: 'Wrong password.' }));
      }
    })
    // eslint-disable-next-line no-console
    .catch(console.log);
};
