/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useMemo, useState } from 'react';

import { Button, IconButton, makeStyles } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { getWorkspace, getWorkspaces } from '../../senders';

const useStyle = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    overflowY: 'scroll',
  },
}));

const TabBar = () => {
  const classes = useStyle();

  const [tabsCount, updateTabsCount] = useState(0);

  const getCurrentWorkspace = () => {
    const workspaces = getWorkspaces();
    const currentWorkspace = Object.values(workspaces).filter((workspace) => workspace.active);

    return currentWorkspace[0];
  };

  const onTabSelected = (tabIndex) => {
    const currentWorkspace = getCurrentWorkspace();
    const { id } = currentWorkspace;

    window.ipcRenderer.send('request-open-tab-browser', { id, tabIndex });
  };

  const onTabAdded = () => {
    updateTabsCount(tabsCount + 1);

    const currentWorkspace = getCurrentWorkspace();
    const { id, homeUrl } = currentWorkspace;

    window.ipcRenderer.send('request-new-tab-browser', { id, tabsCount, homeUrl });
  };

  return (
    <div className={classes.wrapper}>
      {[...Array(tabsCount).keys()].map((i) => (
        <Button
          key={i}
          onClick={() => onTabSelected(i)}>
          {`tab${i}`}
        </Button>)
      )}
      <IconButton
        children={<AddIcon fontSize="small" />}
        onClick={onTabAdded}
      />
    </div>
  );
};

export default TabBar;
