/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { UPDATE_GO_TO_URL_FORM } from '../../constants/actions';
import hasErrors from '../../helpers/has-errors';
import isUrl from '../../helpers/is-url';
import validate from '../../helpers/validate';
import { requestLoadUrl } from '../../senders';

const getValidationRules = () => ({
  url: {
    fieldName: 'URL',
    required: true,
    lessStrictUrl: true,
  },
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_GO_TO_URL_FORM,
  changes: validate(changes, getValidationRules()),
});

export const go = () => (dispatch, getState) => {
  const { form } = getState().dialogGoToUrl;

  const validatedChanges = validate(form, getValidationRules());
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  const { url } = form;
  const finalUrl = isUrl(url) ? url : `http://${url}`;

  requestLoadUrl(finalUrl);
  window.remote.getCurrentWindow().close();
  return null;
};
