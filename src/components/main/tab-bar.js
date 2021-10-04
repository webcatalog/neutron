/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';

import { IconButton, Tab, makeStyles } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import { useSelector } from 'react-redux';

const useStyle = makeStyles(() => ({
  addTabButton: {
    width: 36,
    height: 36,
  },
  tabsWrapper: {
    display: 'flex',
    width: '90vw',
    overflow: 'scroll',
  },
  tabsBarWrapper: {
    display: 'flex',
    height: 36,
  },
  tabItem: {
    display: 'flex',
    flexDirection: 'row',
  }
}));

const TabBar = () => {
  const classes = useStyle();

  const activeWorkspaceId = useSelector((state) => state.workspaces.activeWorkspaceId);
  const currentWorkspace = useSelector((state) => state.workspaces.workspaces[activeWorkspaceId]);

  const [tabsCount, updateTabsCount] = useState(1);
  const [selectedTabIndex, updateSelectedTabIndex] = useState(0);

  const onTabSelected = (e, newTabIndex) => {
    e.stopPropagation();

    const { id } = currentWorkspace;

    window.ipcRenderer.send('request-open-tab-browser', { id, newTabIndex, selectedTabIndex });
    updateSelectedTabIndex(newTabIndex);
  };

  const onTabRemoved = (e, tabIndex) => {
    e.stopPropagation();

    updateTabsCount(tabsCount - 1);

    window.ipcRenderer.send('request-close-tab-browser', { tabIndex });
  };

  const onTabAdded = () => {
    // tabIndex start at 0
    const tabIndex = tabsCount;

    const { homeUrl } = currentWorkspace;

    window.ipcRenderer.send('request-new-tab-browser', { tabIndex, homeUrl });
    updateTabsCount(tabIndex + 1);
  };

  useEffect(() => {
    const { tabs } = currentWorkspace || { };
    const newTabsCount = Object.keys(tabs || { }).length;

    updateTabsCount(newTabsCount);
  }, [activeWorkspaceId]);

  return (
    <div className={classes.tabsBarWrapper}>
      <div className={classes.tabsWrapper}>
        {[...Array(tabsCount).keys()].map((i) => (
          <div
            key={i}
            className={classes.tabItem}
          >
            <Tab
              disableRipple
              label={(
                <span>
                  New tabs
                </span>
              )}
              disabled={selectedTabIndex === i}
              style={{ minHeight: '36px' }}
              onClick={(e) => onTabSelected(e, i)}
            />
            {(tabsCount !== 1) && (
              <IconButton
                onClick={(e) => onTabRemoved(e, i)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </div>
        ))}
      </div>
      <div
        class={classes.addTabButton}
      >
        <IconButton
          onClick={onTabAdded}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

export default TabBar;
