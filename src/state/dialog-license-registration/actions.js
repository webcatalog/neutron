/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_LICENSE_REGISTRATION_FORM_UPDATE,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';
import getStaticGlobal from '../../helpers/get-static-global';

import {
  requestSetPreference,
  requestShowMessageBox,
} from '../../senders';

const getValidationRules = () => ({
  licenseKey: {
    fieldName: 'License Key',
    required: true,
    licenseKey: true,
  },
});

export const updateForm = (changes) => ({
  type: DIALOG_LICENSE_REGISTRATION_FORM_UPDATE,
  changes: validate(changes, getValidationRules()),
});

export const register = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogLicenseRegistration;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  requestSetPreference('standaloneRegistered', true);
  requestSetPreference('standaloneLicenseKey', form.licenseKey);

  const appJson = getStaticGlobal('appJson');
  requestShowMessageBox(`Registration Complete! Thank you for supporting the future development of ${appJson.name}.`);

  window.remote.getCurrentWindow().close();
  return null;
};
