/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_WORKSPACE_META, SET_WORKSPACE_METAS } from '../../constants/actions';

export const setWorkspaceMeta = (id, value) => ({
  type: SET_WORKSPACE_META,
  id,
  value,
});

export const setWorkspaceMetas = (workspaceMetas) => ({
  type: SET_WORKSPACE_METAS,
  workspaceMetas,
});
