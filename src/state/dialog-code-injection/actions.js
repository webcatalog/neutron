import { UPDATE_CODE_INJECTION_FORM } from '../../constants/actions';
import { requestSetPreference, requestShowRequireRestartDialog } from '../../senders';

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_CODE_INJECTION_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogCodeInjection;
  const codeInjectionType = window.remote.getGlobal('codeInjectionType');

  requestSetPreference(`${codeInjectionType}CodeInjection`, form.code);

  if (codeInjectionType === 'js' && typeof form.allowNodeInJsCodeInjection === 'boolean') {
    requestSetPreference('allowNodeInJsCodeInjection', form.allowNodeInJsCodeInjection);
  }

  requestShowRequireRestartDialog();

  window.remote.getCurrentWindow().close();
};
