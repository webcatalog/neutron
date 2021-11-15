/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { IconButton, makeStyles, useTheme } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import Tab from './tabs';
import Divider from './divider';

import themeColors from '../../../constants/theme-colors';

const useStyles = makeStyles((theme) => ({
  tabBarContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 12,
    height: 36,
  },
  addIconButton: {
    padding: 4,
    margin: '6px 0 0 10px',
  },
  addIcon: {
    fontSize: 20,
  },
}));

const TabsBar = () => {
  const classes = useStyles({ backgroundColor, highlightColor });

  const [tabs, updateTabs] = useState([]);

  const { backgroundColor, highlightColor } = useSelector((state) => {
    const { workspaces, activeWorkspaceId } = state.workspaces;
    const activeWorkspace = workspaces[activeWorkspaceId];
    const colorKey = activeWorkspace.preferences.color;

    if (colorKey) {
      const backgroundColor = themeColors[colorKey]['800'];
      const highlightColor = themeColors[colorKey]['600'];

      return { backgroundColor, highlightColor };
    } else {
      return { backgroundColor: 'auto', highlightColor: 'auto' };
    }
  });

  return (
    <div
      className={classes.tabBarContainer}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      <Tab
        key={'green'}
        imageAlt={'green tab image'}
        title={'Green'}
        highlightColor={highlightColor}
      >
      </Tab>
      <Divider/>
      <Tab
        key={'blue'}
        imageAlt={'green tab image'}
        title={'Green'}
        highlightColor={highlightColor}>
      </Tab>
      <Divider/>
      <IconButton
        className={classes.addIconButton}
      >
        <AddIcon className={classes.addIcon} />
      </IconButton>
    </div>
  );
}

export default TabsBar;