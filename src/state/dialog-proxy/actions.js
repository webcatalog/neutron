/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_PROXY_FORM_UPDATE,
  DIALOG_PROXY_OPEN,
  DIALOG_PROXY_CLOSE,
} from '../../constants/actions';

import validate from '../../helpers/validate';
import hasErrors from '../../helpers/has-errors';

import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../senders';

export const open = () => (dispatch, getState) => {
  const {
    proxyAddress,
    proxyBypassRules,
    proxyMode,
    proxyPacScript,
    proxyPort,
    proxyProtocol,
  } = getState().preferences;

  dispatch({
    type: DIALOG_PROXY_OPEN,
    form: {
      proxyAddress,
      proxyBypassRules,
      proxyMode,
      proxyPacScript,
      proxyPort,
      proxyProtocol,
    },
  });
};

export const close = () => ({
  type: DIALOG_PROXY_CLOSE,
});

const getValidationRules = (proxyMode) => {
  if (proxyMode === 'fixed_servers') {
    return {
      proxyProtocol: {
        fieldName: 'Proxy protocol',
        required: true,
      },
      proxyAddress: {
        fieldName: 'Proxy address',
        required: true,
        hostname: true,
      },
      proxyPort: {
        fieldName: 'Proxy port',
        required: true,
        port: true,
      },
    };
  }
  if (proxyMode === 'pac_script') {
    return {
      proxyPacScript: {
        fieldName: 'Script URL',
        required: true,
      },
    };
  }
  return {};
};

export const updateForm = (changes) => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogProxy;

  // revalidate all fields if proxy type changes
  if (changes.proxyMode) {
    const validatedChanges = validate(
      { ...form, ...changes },
      getValidationRules(changes.proxyMode),
    );
    dispatch({
      type: DIALOG_PROXY_FORM_UPDATE,
      changes: validatedChanges,
    });
  } else {
    dispatch({
      type: DIALOG_PROXY_FORM_UPDATE,
      changes: validate(changes, getValidationRules(form.proxyMode)),
    });
  }
};

export const save = () => (dispatch, getState) => {
  const state = getState();

  const { form } = state.dialogProxy;

  const validatedChanges = validate(form, getValidationRules(form.proxyMode));
  if (hasErrors(validatedChanges)) {
    return dispatch(updateForm(validatedChanges));
  }

  if (form.proxyMode === 'fixed_servers') {
    requestSetPreference('proxyAddress', form.proxyAddress.trim());
    requestSetPreference('proxyPort', form.proxyPort.trim());
    requestSetPreference('proxyProtocol', form.proxyProtocol.trim());
    requestSetPreference('proxyBypassRules', form.proxyBypassRules);
  }

  if (form.proxyMode === 'pac_script') {
    requestSetPreference('proxyPacScript', form.proxyPacScript.trim());
    requestSetPreference('proxyBypassRules', form.proxyBypassRules);
  }

  requestSetPreference('proxyMode', form.proxyMode);
  enqueueRequestRestartSnackbar();

  dispatch(close());

  return null;
};
