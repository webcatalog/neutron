/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  UPDATE_DIALOG_CUSTOMIZE_FONTS,
  OPEN_DIALOG_CUSTOMIZE_FONTS,
  CLOSE_DIALOG_CUSTOMIZE_FONTS,
} from '../../constants/actions';
import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../senders';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

export const open = () => (dispatch, getState) => {
  const {
    preferences: {
      defaultFontSize,
      defaultFontSizeMinimum,
      defaultFontSizeMonospace,
    },
  } = getState();

  dispatch({
    type: OPEN_DIALOG_CUSTOMIZE_FONTS,
    form: {
      defaultFontSize,
      defaultFontSizeMinimum,
      defaultFontSizeMonospace,
    },
  });
};

export const close = () => ({
  type: CLOSE_DIALOG_CUSTOMIZE_FONTS,
});

const getValidationRules = () => ({});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_DIALOG_CUSTOMIZE_FONTS,
  changes: validate(changes, getValidationRules()),
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogCustomizeFonts;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    dispatch(updateForm(validatedChanges));
    return;
  }

  requestSetPreference('defaultFontSize', form.defaultFontSize);
  requestSetPreference('defaultFontSizeMinimum', form.defaultFontSizeMinimum);
  requestSetPreference('defaultFontSizeMonospace', form.defaultFontSizeMonospace);

  dispatch(close());
  enqueueRequestRestartSnackbar();
};
