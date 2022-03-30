/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import { Menu, getCurrentWindow } from '@electron/remote';

import { alpha } from '@mui/material/styles';

import 'simplebar/dist/simplebar.min.css';

import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import CircularProgress from '@mui/material/CircularProgress';

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import getWorkspacesAsList from '../../helpers/get-workspaces-as-list';
import getStaticGlobal from '../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';
import isMas from '../../helpers/is-mas';
import isAppx from '../../helpers/is-appx';

import themeColors from '../../constants/theme-colors';

import WorkspaceSelector from './workspace-selector';
import RatingButton from './rating-button';
import BrowserActionList from './browser-action-list';

import {
  requestClearWorkspaceBrowsingData,
  requestCreateWorkspace,
  requestHibernateWorkspace,
  requestReloadWorkspace,
  requestRemoveWorkspace,
  requestSetActiveWorkspace,
  requestSetPreference,
  requestSetWorkspace,
  requestSetWorkspaces,
  requestShowAddWorkspaceWindow,
  requestShowNotificationsWindow,
  requestShowPreferencesWindow,
  requestShowShareMenu,
  requestShowWorkspacePreferencesWindow,
  requestWakeUpWorkspace,
} from '../../senders';

import './main.css';

// https://github.com/sindresorhus/array-move/blob/master/index.js
const arrayMove = (array, from, to) => {
  const newArray = array.slice();
  const startIndex = to < 0 ? newArray.length + to : to;
  const item = newArray.splice(from, 1)[0];
  newArray.splice(startIndex, 0, item);
  return newArray;
};

const SortableItem = sortableElement(({ value }) => {
  const { workspace, themeColor, index } = value;
  const {
    accountInfo,
    active,
    disableAudio,
    disableNotifications,
    hibernated,
    id,
    name,
    pictureId,
    preferredIconType,
    transparentBackground,
    preferences,
  } = workspace;

  return (
    <WorkspaceSelector
      active={active}
      id={id}
      key={id}
      name={name}
      accountInfo={accountInfo}
      pictureId={pictureId}
      transparentBackground={transparentBackground}
      preferredIconType={preferredIconType}
      order={index}
      hibernated={hibernated}
      disableAudio={disableAudio}
      disableNotifications={disableNotifications}
      preferences={preferences}
      onClick={() => requestSetActiveWorkspace(id)}
      themeColor={themeColor}
      onContextMenu={(e) => {
        e.preventDefault();

        const template = [
          {
            label: `Reload ${getWorkspaceFriendlyName()}`,
            click: () => requestReloadWorkspace(id),
          },
          {
            label: hibernated ? `Wake Up ${getWorkspaceFriendlyName()}` : `Hibernate ${getWorkspaceFriendlyName()}`,
            click: () => {
              if (hibernated) {
                return requestWakeUpWorkspace(id);
              }
              return requestHibernateWorkspace(id);
            },
            visible: !active,
          },
          { type: 'separator' },
          {
            label: `Clear ${getWorkspaceFriendlyName()}'s Browsing Data`,
            click: () => requestClearWorkspaceBrowsingData(id),
            visible: !getStaticGlobal('shareWorkspaceBrowsingData'),
          },
          {
            type: 'separator',
            visible: !getStaticGlobal('shareWorkspaceBrowsingData'),
          },
          {
            label: `Edit ${getWorkspaceFriendlyName()}`,
            click: () => requestShowWorkspacePreferencesWindow(id),
          },
          {
            label: `Remove ${getWorkspaceFriendlyName()}`,
            click: () => requestRemoveWorkspace(id),
          },
          { type: 'separator' },
          {
            type: 'checkbox',
            checked: !disableNotifications,
            label: 'Notifications',
            click: () => {
              requestSetWorkspace(
                id,
                { disableNotifications: !disableNotifications },
              );
            },
          },
          {
            type: 'checkbox',
            checked: !disableAudio,
            label: 'Sound',
            click: () => {
              requestSetWorkspace(
                id,
                { disableAudio: !disableAudio },
              );
            },
          },
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup({
          window: getCurrentWindow(),
        });
      }}
    />
  );
});

const SortableContainer = sortableContainer(({ children }) => <Box>{children}</Box>);

const ScrollbarContainer = ({ children, sx }) => {
  // SimpleBar brings problems on macOS
  // https://github.com/webcatalog/webcatalog-app/issues/1247
  if (window.process.platform === 'darwin') {
    return (
      <Box sx={sx}>
        {children}
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      {children}
    </Box>
  );
};

ScrollbarContainer.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.string.isRequired,
};

const Sidebar = () => {
  const activeWorkspace = useSelector(
    (state) => state.workspaces.workspaces[state.workspaces.activeWorkspaceId],
  );
  const isFullScreen = useSelector((state) => state.general.isFullScreen);
  const isLoading = useSelector((state) => (
    activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading)
      : false));
  const navigationBar = useSelector((state) => (window.process.platform === 'linux'
  && state.preferences.attachToMenubar
  && !state.preferences.sidebar)
  || state.preferences.navigationBar);
  const shouldPauseNotifications = useSelector(
    (state) => state.notifications.pauseNotificationsInfo !== null,
  );
  const sidebarAddButton = useSelector((state) => state.preferences.sidebarAddButton);
  const sidebarSize = useSelector((state) => state.preferences.sidebarSize);
  const titleBar = useSelector((state) => state.preferences.titleBar);
  const muteApp = useSelector((state) => state.preferences.muteApp);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const themeColor = useSelector((state) => (() => {
    if (state.preferences.themeColor === 'auto') {
      if (activeWorkspace && activeWorkspace.preferences && activeWorkspace.preferences.color) {
        return activeWorkspace.preferences.color;
      }
      return null;
    }
    return state.preferences.themeColor;
  })());

  const appJson = getStaticGlobal('appJson');
  const workspacesList = getWorkspacesAsList(workspaces);
  const showMacTitleBar = window.process.platform === 'darwin' && titleBar && !isFullScreen;
  const isSidebarExpanded = sidebarSize === 'expanded';
  const rtl = getStaticGlobal('rtlCoordination');

  // Big Sur increases title bar height: https://github.com/microsoft/vscode/pull/110592 (28px)
  // but following Electron@13, somehow the height is now also 22px on Big Sur
  const titleBarHeight = 22;

  return (
    <ScrollbarContainer
      sx={[
        (theme) => ({
          display: 'flex',
          height: 1,
          width: 68,
          bgcolor: (props) => {
            if (props.themeColor != null) {
              return themeColors[props.themeColor][800];
            }
            return theme.palette.background.paper;
          },
          overflowX: 'hidden',
        }),
        isSidebarExpanded && { width: 256 },
        rtl ? {
          borderLeft: '1px solid',
          borderLeftColor: 'divider',
        } : {
          borderRight: '1px solid',
          borderRightColor: 'divider',
        },
      ]}
    >
      <Box
        sx={{
          flex: 1,
          width: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pb: 1,
          boxSizing: 'border-box',
        }}
      >
        {window.process.platform === 'darwin' && !isFullScreen && !showMacTitleBar && (
          <Box
            sx={[
              {
                width: 1,
                height: titleBarHeight + 4,
                WebkitAppRegion: 'drag',
                WebkitUserSelect: 'none',
              },
              navigationBar && { height: 36 },
            ]}
          />
        )}
        <Box
          sx={{
            flex: 1,
            width: 1,
            WebkitAppRegion: 'drag',
            WebkitUserSelect: 'none',
            pb: 5,
          }}
        >
          <SortableContainer
            distance={10}
            helperClass={{
              cursor: 'grabbing !important',
              pointerEvents: 'auto !important',
            }}
            onSortEnd={({ oldIndex, newIndex }) => {
              if (oldIndex === newIndex) return;

              const newWorkspacesList = arrayMove(workspacesList, oldIndex, newIndex);
              const newWorkspaces = { ...workspaces };
              newWorkspacesList.forEach((workspace, i) => {
                newWorkspaces[workspace.id].order = i;
              });

              requestSetWorkspaces(newWorkspaces);
            }}
          >
            {workspacesList.map((workspace, i) => (
              <SortableItem key={`item-${workspace.id}`} index={i} value={{ index: i, workspace, themeColor }} />
            ))}
          </SortableContainer>
          {sidebarAddButton && (
            <WorkspaceSelector
              id="add"
              themeColor={themeColor}
              onClick={() => {
                if (!appJson.url) {
                  requestShowAddWorkspaceWindow();
                  return;
                }
                requestCreateWorkspace();
              }}
              onContextMenu={!appJson.url ? null : (e) => {
                e.preventDefault();
                const template = [
                  {
                    label: `Add ${appJson.name} ${getWorkspaceFriendlyName()}`,
                    click: () => requestCreateWorkspace(),
                  },
                  {
                    label: `Add Custom ${getWorkspaceFriendlyName()}`,
                    click: () => requestShowAddWorkspaceWindow(),
                  },
                ];

                const menu = Menu.buildFromTemplate(template);
                menu.popup({
                  window: getCurrentWindow(),
                });
              }}
            />
          )}
        </Box>
        {!navigationBar && !isMas() && !isAppx() && (
          <BrowserActionList
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
            }}
          />
        )}
        {!navigationBar && (
        <Box
          sx={[
            {
              display: 'flex',
              flexDirection: 'column',
              width: 1,
            },
            isSidebarExpanded && {
              display: 'block',
              p: 1,
            },
          ]}
        >
          {!titleBar && isLoading && (
            <Box
              sx={{
                width: 1,
                display: 'flex',
                justifyContent: 'center',
                p: 1,
              }}
            >
              <CircularProgress
                size={20}
                sx={(theme) => ({
                  color: (props) => {
                    if (props.themeColor != null) {
                      // eslint-disable-next-line max-len
                      return alpha(theme.palette.getContrastText(themeColors[props.themeColor][900]), 0.7);
                    }
                    return theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgb(77, 77, 77)';
                  },
                })}
              />
            </Box>
          )}
          <RatingButton
            sx={[
              (theme) => ({
                color: (props) => {
                  if (props.themeColor != null) {
                    return theme.palette.getContrastText(themeColors[props.themeColor][800]);
                  }
                  return theme.palette.text.secondary;
                },
              }),
              !isSidebarExpanded && {
                width: 1,
                borderRadius: 0,
              },
            ]}
            size="small"
          />
          {window.process.platform === 'darwin' && (
            <IconButton
              title="Share"
              aria-label="Share"
              onClick={() => requestShowShareMenu()}
              sx={[
                (theme) => ({
                  color: (props) => {
                    if (props.themeColor != null) {
                      return theme.palette.getContrastText(themeColors[props.themeColor][800]);
                    }
                    return theme.palette.text.secondary;
                  },
                }),
                !isSidebarExpanded && {
                  width: 1,
                  borderRadius: 0,
                },
                {
                  '& .Mui-disabled': (theme) => ({
                    color: (props) => {
                      if (props.themeColor != null) {
                        return `${alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3)} !important`;
                      }
                      return theme.palette.text.disabled;
                    },
                  }),
                },
              ]}
              size="small"
              disabled={workspacesList.length < 1}
            >
              <SvgIcon>
                <path fill="currentColor" d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z" />
              </SvgIcon>
            </IconButton>
          )}
          <IconButton
            title="Notifications"
            aria-label="Notifications"
            onClick={requestShowNotificationsWindow}
            sx={[
              (theme) => ({
                color: (props) => {
                  if (props.themeColor != null) {
                    return theme.palette.getContrastText(themeColors[props.themeColor][800]);
                  }
                  return theme.palette.text.secondary;
                },
              }),
              !isSidebarExpanded && {
                width: 1,
                borderRadius: 0,
              },
              {
                '& .Mui-disabled': (theme) => ({
                  color: (props) => {
                    if (props.themeColor != null) {
                      return `${alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3)} !important`;
                    }
                    return theme.palette.text.disabled;
                  },
                }),
              },
            ]}
            size="small"
          >
            {shouldPauseNotifications ? <NotificationsPausedIcon /> : <NotificationsIcon />}
          </IconButton>
          <IconButton
            title={muteApp ? 'Unmute' : 'Mute'}
            aria-label={muteApp ? 'Unmute' : 'Mute'}
            onClick={() => requestSetPreference('muteApp', !muteApp)}
            sx={[
              (theme) => ({
                color: (props) => {
                  if (props.themeColor != null) {
                    return theme.palette.getContrastText(themeColors[props.themeColor][800]);
                  }
                  return theme.palette.text.secondary;
                },
              }),
              !isSidebarExpanded && {
                width: 1,
                borderRadius: 0,
              },
              {
                '& .Mui-disabled': (theme) => ({
                  color: (props) => {
                    if (props.themeColor != null) {
                      return `${alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3)} !important`;
                    }
                    return theme.palette.text.disabled;
                  },
                }),
              },
            ]}
            size="small"
          >
            {muteApp ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
          <IconButton
            title="Preferences"
            aria-label="Preferences"
            onClick={() => requestShowPreferencesWindow()}
            sx={[
              {

              },
              !isSidebarExpanded && {
                width: 1,
                borderRadius: 0,
              },
              {
                '& .Mui-disabled': (theme) => ({
                  color: (props) => {
                    if (props.themeColor != null) {
                      return `${alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3)} !important`;
                    }
                    return theme.palette.text.disabled;
                  },
                }),
              },
            ]}
            size="small"
          >
            <SettingsIcon />
          </IconButton>
        </Box>
        )}
      </Box>
    </ScrollbarContainer>
  );
};

Sidebar.defaultProps = {
  themeColor: null,
};

Sidebar.propTypes = {
  themeColor: PropTypes.string,
};

export default Sidebar;
