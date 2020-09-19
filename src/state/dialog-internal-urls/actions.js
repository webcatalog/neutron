import {
  UPDATE_DIALOG_INTERNAL_URLS,
  OPEN_DIALOG_INTERNAL_URLS,
  CLOSE_DIALOG_INTERNAL_URLS,
} from '../../constants/actions';
import {
  requestSetPreference,
} from '../../senders';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import { updateForm as updateFormDialogWorkspacePreferences } from '../dialog-workspace-preferences/actions';

export const open = () => (dispatch, getState) => {
  if (window.mode === 'workspace-preferences') {
    const { form } = getState().dialogWorkspacePreferences;
    dispatch({
      type: OPEN_DIALOG_INTERNAL_URLS,
      form: { internalUrlRule: form.internalUrlRule },
    });
    return;
  }

  const { preferences } = getState();
  dispatch({
    type: OPEN_DIALOG_INTERNAL_URLS,
    form: { internalUrlRule: preferences.internalUrlRule },
  });
};

export const close = () => ({
  type: CLOSE_DIALOG_INTERNAL_URLS,
});

const getValidationRules = () => ({
  internalUrlRule: {
    fieldName: 'Internal URL Rule',
    regExp: true,
  },
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_DIALOG_INTERNAL_URLS,
  changes: validate(changes, getValidationRules()),
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogInternalUrls;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  if (window.mode === 'workspace-preferences') {
    dispatch(updateFormDialogWorkspacePreferences({
      internalUrlRule: form.internalUrlRule,
    }));
  } else {
    requestSetPreference('internalUrlRule', form.internalUrlRule);
  }

  dispatch(close());
};
