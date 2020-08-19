import { SET_PREFERENCE } from '../../constants/actions';

const preferences = (state = {}, action) => {
  switch (action.type) {
    case SET_PREFERENCE: {
      const newState = { ...state };
      newState[action.name] = action.value;

      return newState;
    }
    default:
      return state;
  }
};

export default preferences;
