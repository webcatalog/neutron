import { SET_WORKSPACE, SET_WORKSPACES } from '../../constants/actions';

const workspaces = (state = {}, action) => {
  switch (action.type) {
    case SET_WORKSPACES: {
      return action.workspaces;
    }
    case SET_WORKSPACE: {
      const newState = { ...state };

      if (action.value) newState[action.id] = { ...newState[action.id], ...action.value };
      else delete newState[action.id];

      return newState;
    }
    default:
      return state;
  }
};

export default workspaces;
