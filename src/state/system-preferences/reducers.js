import { SET_SYSTEM_PREFERENCE } from '../../constants/actions';

const systemPreferences = (state = {}, action) => {
  switch (action.type) {
    case SET_SYSTEM_PREFERENCE: {
      const newState = { ...state };
      newState[action.name] = action.value;

      return newState;
    }
    default:
      return state;
  }
};

export default systemPreferences;
