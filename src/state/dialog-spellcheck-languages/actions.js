/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_SPELLCHECK_LANGUAGES_UPDATE_FORM,
  DIALOG_SPELLCHECK_LANGUAGES_OPEN,
  DIALOG_SPELLCHECK_LANGUAGES_CLOSE,
} from '../../constants/actions';
import { requestSetPreference, enqueueRequestRestartSnackbar } from '../../senders';

export const open = () => (dispatch, getState) => {
  const { preferences } = getState();

  dispatch({
    type: DIALOG_SPELLCHECK_LANGUAGES_OPEN,
    form: { spellcheckLanguages: preferences.spellcheckLanguages },
  });
};

export const close = () => ({
  type: DIALOG_SPELLCHECK_LANGUAGES_CLOSE,
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: DIALOG_SPELLCHECK_LANGUAGES_UPDATE_FORM,
  changes,
});

export const addLanguage = (code) => (dispatch, getState) => {
  const { spellcheckLanguages } = getState().dialogSpellcheckLanguages.form;
  if (!spellcheckLanguages.includes(code)) {
    dispatch(updateForm({
      spellcheckLanguages: [...spellcheckLanguages, code],
    }));
  }
};

export const removeLanguage = (code) => (dispatch, getState) => {
  const { spellcheckLanguages } = getState().dialogSpellcheckLanguages.form;
  const filteredSpellCheckerLanguages = spellcheckLanguages
    .filter((lang) => lang !== code);
  dispatch(updateForm({
    spellcheckLanguages: filteredSpellCheckerLanguages,
  }));
};

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogSpellcheckLanguages;

  requestSetPreference('spellcheckLanguages', form.spellcheckLanguages);

  enqueueRequestRestartSnackbar();

  dispatch(close());
};
