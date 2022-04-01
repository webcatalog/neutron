/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  CLOSE_FIND_IN_PAGE,
  OPEN_FIND_IN_PAGE,
  UPDATE_FIND_IN_PAGE_TEXT,
  UPDATE_FIND_IN_PAGE_MATCHES,
} from '../../constants/actions';

const initialState = {
  open: false,
  text: '',
  activeMatch: 0,
  matches: 0,
};

const findInPage = (state = initialState, action) => {
  switch (action.type) {
    case CLOSE_FIND_IN_PAGE: {
      return { ...state, open: false };
    }
    case OPEN_FIND_IN_PAGE: {
      return { ...state, open: true };
    }
    case UPDATE_FIND_IN_PAGE_TEXT: {
      return { ...state, text: action.text };
    }
    case UPDATE_FIND_IN_PAGE_MATCHES: {
      return {
        ...state,
        activeMatch: action.activeMatch,
        matches: action.matches,
      };
    }
    default:
      return state;
  }
};

export default findInPage;
