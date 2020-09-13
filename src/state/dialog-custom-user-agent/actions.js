import {
  UPDATE_CUSTOM_USER_AGENT_FORM,
  OPEN_CUSTOM_USER_AGENT_FORM,
  CLOSE_CUSTOM_USER_AGENT_FORM,
} from '../../constants/actions';
import {
  requestSetPreference,
  requestShowRequireRestartDialog,
} from '../../senders';

export const open = () => (dispatch, getState) => {
  const { preferences } = getState();

  dispatch({
    type: OPEN_CUSTOM_USER_AGENT_FORM,
    form: { code: preferences.customUserAgent },
  });
};

export const close = () => ({
  type: CLOSE_CUSTOM_USER_AGENT_FORM,
});

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_CUSTOM_USER_AGENT_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogCustomUserAgent;

  requestSetPreference('customUserAgent', form.code);

  dispatch(close());

  requestShowRequireRestartDialog();
};
