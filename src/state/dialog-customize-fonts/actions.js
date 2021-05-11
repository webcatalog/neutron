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
      defaultFontFamilyStandard,
      defaultFontFamilySerif,
      defaultFontFamilySansSerif,
      defaultFontFamilyMonospace,
      defaultFontSize,
      defaultFontSizeMinimum,
    },
  } = getState();

  dispatch({
    type: OPEN_DIALOG_CUSTOMIZE_FONTS,
    form: {
      defaultFontFamilyStandard,
      defaultFontFamilySerif,
      defaultFontFamilySansSerif,
      defaultFontFamilyMonospace,
      defaultFontSize,
      defaultFontSizeMinimum,
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

  requestSetPreference('defaultFontFamilyMonospace', form.defaultFontFamilyMonospace);
  requestSetPreference('defaultFontFamilySansSerif', form.defaultFontFamilySansSerif);
  requestSetPreference('defaultFontFamilySerif', form.defaultFontFamilySerif);
  requestSetPreference('defaultFontFamilyStandard', form.defaultFontFamilyStandard);
  requestSetPreference('defaultFontSize', form.defaultFontSize);
  requestSetPreference('defaultFontSizeMinimum', form.defaultFontSizeMinimum);

  dispatch(close());
  enqueueRequestRestartSnackbar();
};
