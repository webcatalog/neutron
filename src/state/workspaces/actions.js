/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { SET_WORKSPACE, SET_WORKSPACES } from '../../constants/actions';

import { requestCreateWorkspace } from '../../senders';

import billingPlans from '../../constants/billing-plans';

import { getCurrentPlan } from '../user/utils';
import { checkPlan } from '../user/actions';

import getStaticGlobal from '../../helpers/get-static-global';

export const setWorkspace = (id, value) => ({
  type: SET_WORKSPACE,
  id,
  value,
});

export const setWorkspaces = (workspaces) => ({
  type: SET_WORKSPACES,
  workspaces,
});

export const createWorkspace = (workspaceObj) => (dispatch, getState) => {
  const currentPlan = getCurrentPlan(getState().user);
  const appJson = getStaticGlobal('appJson');
  const isMultisite = !appJson.url;
  const limit = isMultisite
    ? billingPlans[currentPlan].workspacesPerMultisiteApp
    : billingPlans[currentPlan].workspacesPerSinglesiteApp;

  const canContinue = dispatch(checkPlan(
    `Your current plan only allows you to add up to ${limit} workspaces per ${isMultisite ? 'multisite' : 'singlesite'} app`,
    (state) => {
      const workspaceCount = Object.keys(state.workspaces).length;
      return !(limit !== 'Unlimited' && workspaceCount >= limit);
    },
  ));

  if (canContinue) {
    requestCreateWorkspace(workspaceObj);
  }
};
