/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import { Box, IconButton } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';

import { useSelector } from 'react-redux';

import Tab from './tab';

import themeColors from '../../../constants/theme-colors';

import {
  requestAddWorkspaceTab, requestRemoveWorkspaceTab, requestSetWorkspace,
} from '../../../senders';

const TabBar = ({ themeColor }) => {
  const activeWorkspaceId = useSelector((state) => state.workspaces.activeWorkspaceId);
  const currentWorkspace = useSelector((state) => state.workspaces.workspaces[activeWorkspaceId]);

  const tabs = useSelector((state) => state.workspaceTabs[activeWorkspaceId]) || {};

  if (!currentWorkspace) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        overflow: 'auto',
        height: 36,
        backgroundColor: (props) => {
          if (props.themeColor != null) {
            return themeColors[props.themeColor][900];
          }
          return (theme) => (theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200]);
        },
        WebkitUserSelect: 'none',
        WebkitAppRegion: 'drag',
      }}
    >
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ml: 1,
          WebkitAppRegion: 'no-drag',
        }}
      >
        <IconButton
          onClick={() => requestAddWorkspaceTab(activeWorkspaceId)}
          sx={{
            p: 6,
            WebkitAppRegion: 'no-drag',
            color: (props) => {
              if (props.themeColor != null) {
                return (theme) => theme.palette.getContrastText(themeColors[props.themeColor][800]);
              }
              return 'text.primary';
            },
          }}
          size="large"
        >
          <AddIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

TabBar.defaultProps = {
  themeColor: undefined,
};

TabBar.propTypes = {
  themeColor: PropTypes.string,
};

export default TabBar;
