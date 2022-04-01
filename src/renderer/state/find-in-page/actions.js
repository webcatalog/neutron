/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  CLOSE_FIND_IN_PAGE,
  OPEN_FIND_IN_PAGE,
  UPDATE_FIND_IN_PAGE_TEXT,
  UPDATE_FIND_IN_PAGE_MATCHES,
} from '../../constants/actions';

export const closeFindInPage = () => ({
  type: CLOSE_FIND_IN_PAGE,
});

export const openFindInPage = () => ({
  type: OPEN_FIND_IN_PAGE,
});

export const updateFindInPageText = (text) => ({
  type: UPDATE_FIND_IN_PAGE_TEXT,
  text,
});

export const updateFindInPageMatches = (activeMatch, matches) => ({
  type: UPDATE_FIND_IN_PAGE_MATCHES,
  activeMatch,
  matches,
});
