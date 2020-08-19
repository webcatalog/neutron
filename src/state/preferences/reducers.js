import { SET_PREFERENCE } from '../../constants/actions';

import { getPreferences } from '../../senders';

const getInitialState = () => {
  const cachedState = window.localStorage.getItem('preferences');
  if (cachedState) {
    return JSON.parse(cachedState);
  }
  const latestState = getPreferences();
  window.localStorage.setItem('preferences', JSON.stringify(latestState));
  return latestState;
};
const initialState = getInitialState();

const preferences = (state = initialState, action) => {
  switch (action.type) {
    case SET_PREFERENCE: {
      const newState = { ...state };
      newState[action.name] = action.value;

      window.localStorage.setItem('preferences', JSON.stringify(newState));

      return newState;
    }
    default:
      return state;
  }
};

export default preferences;
