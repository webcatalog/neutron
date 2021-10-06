/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import { IconButton, makeStyles } from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

import { useSelector } from 'react-redux';

import Tab from './tab';

import themeColors from '../../../constants/theme-colors';

import {
  requestAddWorkspaceTab, requestRemoveWorkspaceTab, requestSetWorkspace,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'auto',
    height: 36,
    backgroundColor: (props) => {
      if (props.themeColor != null) {
        return themeColors[props.themeColor][900];
      }
      return theme.palette.type === 'dark' ? theme.palette.background.default : theme.palette.grey[200];
    },
    WebkitUserSelect: 'none',
    WebkitAppRegion: 'drag',
  },
  iconButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing(1),
    WebkitAppRegion: 'no-drag',
  },
  iconButton: {
    padding: 6,
    WebkitAppRegion: 'no-drag',
    color: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(themeColors[props.themeColor][800]);
      }
      return theme.palette.text.primary;
    },
  },
  icon: {
    fontSize: '18px',
  },
}));

const TabBar = ({ themeColor }) => {
  const classes = useStyles({ themeColor });

  const activeWorkspaceId = useSelector((state) => state.workspaces.activeWorkspaceId);
  const currentWorkspace = useSelector((state) => state.workspaces.workspaces[activeWorkspaceId]);

  const tabs = useSelector((state) => state.workspaceTabs[activeWorkspaceId]) || {};

  return (
    <div className={classes.root}>
      <Tab
        active={!currentWorkspace.selectedTabId}
        themeColor={themeColor}
        onSelect={() => requestSetWorkspace(activeWorkspaceId, {
          selectedTabId: null,
        })}
      />
      {Object.keys(tabs).map((tabId) => (
        <Tab
          key={tabId}
          name={tabId}
          active={currentWorkspace.selectedTabId === tabId}
          onClose={() => requestRemoveWorkspaceTab(activeWorkspaceId, tabId)}
          onSelect={() => requestSetWorkspace(activeWorkspaceId, {
            selectedTabId: tabId,
          })}
          themeColor={themeColor}
        />
      ))}
      <div
        className={classes.iconButtonContainer}
      >
        <IconButton
          onClick={() => requestAddWorkspaceTab(activeWorkspaceId)}
          className={classes.iconButton}
        >
          <AddIcon className={classes.icon} />
        </IconButton>
      </div>
    </div>
  );
};

TabBar.defaultProps = {
  themeColor: undefined,
};

TabBar.propTypes = {
  themeColor: PropTypes.string,
};

export default TabBar;
