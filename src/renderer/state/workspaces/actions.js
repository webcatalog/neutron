/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_WORKSPACE, SET_WORKSPACES } from '../../constants/actions';

export const setWorkspace = (id, value) => ({
  type: SET_WORKSPACE,
  id,
  value,
});

export const setWorkspaces = (workspaces) => ({
  type: SET_WORKSPACES,
  workspaces,
});
