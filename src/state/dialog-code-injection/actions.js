import {
  UPDATE_CODE_INJECTION_FORM,
  OPEN_CODE_INJECTION_FORM,
  CLOSE_CODE_INJECTION_FORM,
} from '../../constants/actions';
import { requestSetPreference, requestShowRequireRestartDialog } from '../../senders';

export const open = (codeInjectionType) => (dispatch, getState) => {
  const { preferences } = getState();

  dispatch({
    type: OPEN_CODE_INJECTION_FORM,
    codeInjectionType,
    form: {
      code: preferences[`${codeInjectionType}CodeInjection`],
      // allowNodeInJsCodeInjection is only used for js injection
      allowNodeInJsCodeInjection: codeInjectionType === 'js' ? preferences.allowNodeInJsCodeInjection : false,
    },
  });
};

export const close = () => ({
  type: CLOSE_CODE_INJECTION_FORM,
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_CODE_INJECTION_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form, codeInjectionType } = getState().dialogCodeInjection;

  requestSetPreference(`${codeInjectionType}CodeInjection`, form.code);

  if (codeInjectionType === 'js' && typeof form.allowNodeInJsCodeInjection === 'boolean') {
    requestSetPreference('allowNodeInJsCodeInjection', form.allowNodeInJsCodeInjection);
  }

  dispatch(close());

  requestShowRequireRestartDialog();
};
