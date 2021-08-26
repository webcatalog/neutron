/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';

import { Button, IconButton, makeStyles } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { getWorkspace, getWorkspaces } from '../../senders';

const useStyle = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    overflowY: 'scroll',
  },
}));

const TabBar = () => {
  const classes = useStyle();

  const [tabsCount, updateTabsCount] = useState(1);
  const [selectedTabIndex, updateSelectedTabIndex] = useState(0);

  useEffect(() => {
    const { tabs } = getCurrentWorkspace();
    const tabsCount = Object.keys(tabs || { }).length;

    updateTabsCount(tabsCount);
  }, []);

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

  const onTabRemoved = (tabIndex) => {
    updateTabsCount(tabsCount - 1);

    window.ipcRenderer.send('request-close-tab-browser', { tabIndex });
  };

  const onTabAdded = () => {
    // tabIndex start at 0
    const tabIndex = tabsCount;

    const currentWorkspace = getCurrentWorkspace();
    const { homeUrl } = currentWorkspace;

    updateTabsCount(tabIndex + 1);
    window.ipcRenderer.send('request-new-tab-browser', { tabIndex, homeUrl });
  };

  return (
    <div className={classes.wrapper}>
      {[...Array(tabsCount).keys()].map((i) => (
        <Button
          key={i}
          disableRipple
          onClick={() => onTabSelected(i)}>
          {`New tabs`}
          <IconButton
            children={<CloseIcon fontSize="small" />}
            onClick={onTabRemoved}
          />
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
