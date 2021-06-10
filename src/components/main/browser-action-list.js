/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';
import getStaticGlobal from '../../helpers/get-static-global';

const BrowserActionList = ({ className, partitionId }) => {
  if (partitionId == null) return null;
  return (
    <browser-action-list partition={partitionId} class={className} />
  );
};

BrowserActionList.defaultProps = {
  partitionId: null,
};

BrowserActionList.propTypes = {
  className: PropTypes.string.isRequired,
  partitionId: PropTypes.string,
};

const mapStateToProps = (state) => {
  const activeWorkspace = state.workspaces.workspaces[state.workspaces.activeWorkspaceId];
  const shareWorkspaceBrowsingData = getStaticGlobal('shareWorkspaceBrowsingData');

  let partitionId = null;
  if (activeWorkspace) {
    if (shareWorkspaceBrowsingData) partitionId = 'persist:shared';
    else partitionId = `persist:${activeWorkspace.id}`;
  }

  return {
    partitionId,
  };
};

export default connectComponent(
  BrowserActionList,
  mapStateToProps,
);
