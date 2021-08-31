/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { UPDATE_AUTH_FORM } from '../../constants/actions';

import { requestValidateAuthIdentity } from '../../senders';

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_AUTH_FORM,
  changes,
});

export const login = () => (dispatch, getState) => {
  const { form } = getState().dialogAuth;

  const { username, password } = form;

  requestValidateAuthIdentity(window.remote.getCurrentWindow().id, username, password);
};
