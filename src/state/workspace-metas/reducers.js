import { SET_WORKSPACE_META, SET_WORKSPACE_METAS } from '../../constants/actions';

import { getWorkspaceMetas } from '../../senders';

const getInitialState = () => {
  const cachedState = window.localStorage.getItem('getWorkspaceMetas');
  if (cachedState) {
    return JSON.parse(cachedState);
  }
  const latestState = getWorkspaceMetas();
  window.localStorage.setItem('getWorkspaceMetas', JSON.stringify(latestState));
  return latestState;
};
const initialState = getInitialState();

const workspaceMetas = (state = initialState, action) => {
  switch (action.type) {
    case SET_WORKSPACE_METAS: {
      window.localStorage.setItem('workspaceMetas', JSON.stringify(action.workspaces));
      return action.workspaceMetas;
    }
    case SET_WORKSPACE_META: {
      const newState = { ...state };

      if (action.value) newState[action.id] = { ...newState[action.id], ...action.value };
      else delete newState[action.id];

      window.localStorage.setItem('workspaceMetas', JSON.stringify(newState));
      return newState;
    }
    default:
      return state;
  }
};

export default workspaceMetas;
