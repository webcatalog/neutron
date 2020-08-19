import { SET_WORKSPACE, SET_WORKSPACES } from '../../constants/actions';

import { getWorkspaces } from '../../senders';

const getInitialState = () => {
  const cachedState = window.localStorage.getItem('workspaces');
  if (cachedState) {
    return JSON.parse(cachedState);
  }
  const latestState = getWorkspaces();
  window.localStorage.setItem('workspaces', JSON.stringify(latestState));
  return latestState;
};
const initialState = getInitialState();

const workspaces = (state = initialState, action) => {
  switch (action.type) {
    case SET_WORKSPACES: {
      window.localStorage.setItem('workspaces', JSON.stringify(action.workspaces));
      return action.workspaces;
    }
    case SET_WORKSPACE: {
      const newState = { ...state };

      if (action.value) newState[action.id] = { ...newState[action.id], ...action.value };
      else delete newState[action.id];

      window.localStorage.setItem('workspaces', JSON.stringify(newState));

      return newState;
    }
    default:
      return state;
  }
};

export default workspaces;
