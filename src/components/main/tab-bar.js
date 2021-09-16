/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';



import { Button, IconButton, makeStyles } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { getWorkspaces } from '../../senders';
import { useSelector } from 'react-redux';

const useStyle = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
  },
}));

const TabBar = () => {
  const classes = useStyle();

  const workspaceCount = useSelector((state) => Object.keys((state.workspaceMetas || {})).length);
  const shouldRenderTabBar = (workspaceCount !== 0);

  const [tabsCount, updateTabsCount] = useState(1);
  const [selectedTabIndex, updateSelectedTabIndex] = useState(0);

  useEffect(() => {
    const { tabs } = getCurrentWorkspace() || { };
    const tabsCount = Object.keys(tabs || { }).length;

    updateTabsCount(tabsCount);
  }, []);

  const getCurrentWorkspace = () => {
    const workspaces = getWorkspaces();
    const currentWorkspace = Object.values(workspaces).filter((workspace) => workspace.active);

    return currentWorkspace[0];
  };

  const onTabSelected = (e, tabIndex) => {
    e.stopPropagation();

    const currentWorkspace = getCurrentWorkspace();
    const { id } = currentWorkspace;

    updateSelectedTabIndex(tabIndex);
    window.ipcRenderer.send('request-open-tab-browser', { id, tabIndex });
  };

  const onTabRemoved = (e, tabIndex) => {
    e.stopPropagation();

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
    <>
      {shouldRenderTabBar && <div className={classes.wrapper}>
        {[...Array(tabsCount).keys()].map((i) => {
          const isSelectedTab = (selectedTabIndex === i);

          return (
            <Button
              key={i}
              disableRipple
              disabled={isSelectedTab}
              onClick={(e) => onTabSelected(e, i)}>
              {`New tabs`}
              {(tabsCount !== 1) && (
                <IconButton
                  children={<CloseIcon fontSize="small" />}
                  onClick={(e) => onTabRemoved(e, i)}
                />
              )}
            </Button>
          )}
        )}
        <IconButton
          children={<AddIcon fontSize="small" />}
          onClick={onTabAdded}
        />
      </div>}
    </>
  );
};

export default TabBar;
