/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import CircularProgress from '@material-ui/core/CircularProgress';

import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import SettingsIcon from '@material-ui/icons/Settings';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import connectComponent from '../../helpers/connect-component';
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
  requestCreateWorkspace,
  requestHibernateWorkspace,
  requestRemoveWorkspace,
  requestSetActiveWorkspace,
  requestSetPreference,
  requestSetWorkspace,
  requestSetWorkspaces,
  requestShowAddWorkspaceWindow,
  requestShowWorkspacePreferencesWindow,
  requestShowNotificationsWindow,
  requestShowPreferencesWindow,
  requestShowShareMenu,
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

const useStyles = makeStyles((theme) => {
  // Big Sur increases title bar height: https://github.com/microsoft/vscode/pull/110592 (28px)
  // but following Electron@13, somehow the height is now also 22px on Big Sur
  const titleBarHeight = 22;

  return {
    sidebarUpperRoot: {
      display: 'flex',
      height: '100%',
      width: 68,
      backgroundColor: (props) => {
        if (props.themeColor != null) {
          return themeColors[props.themeColor][800];
        }
        return theme.palette.background.paper;
      },
      overflowX: 'hidden',
    },
    sidebarUpperRootLeft: {
      borderRight: '1px solid',
      borderRightColor: theme.palette.divider,
    },
    sidebarUpperRootRight: {
      borderLeft: '1px solid',
      borderLeftColor: theme.palette.divider,
    },
    sidebarUpperRootWide: {
      width: 256,
    },
    sidebarRoot: {
      flex: 1,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: theme.spacing(1),
      boxSizing: 'border-box',
    },
    sidebarDraggableArea: {
      width: '100%',
      height: titleBarHeight + 4,
      WebkitAppRegion: 'drag',
      WebkitUserSelect: 'none',
    },
    sidebarDraggableAreaWithNavigationBar: {
      height: 36,
    },
    sidebarTop: {
      flex: 1,
      width: '100%',
      WebkitAppRegion: 'drag',
      WebkitUserSelect: 'none',
      paddingBottom: theme.spacing(5),
    },
    grabbing: {
      cursor: 'grabbing !important',
      pointerEvents: 'auto !important',
    },
    end: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    endExpanded: {
      display: 'block',
      padding: theme.spacing(1),
    },
    iconButtonVertical: {
      width: '100%',
      borderRadius: 0,
    },
    iconButton: {
      color: (props) => {
        if (props.themeColor != null) {
          return theme.palette.getContrastText(themeColors[props.themeColor][800]);
        }
        return theme.palette.text.secondary;
      },
    },
    iconButtonDisabled: {
      color: (props) => {
        if (props.themeColor != null) {
          return `${fade(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3)} !important`;
        }
        return theme.palette.text.disabled;
      },
    },
    browserActionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
    progressContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      padding: theme.spacing(1),
    },
    progress: {
      color: (props) => {
        if (props.themeColor != null) {
          return fade(theme.palette.getContrastText(themeColors[props.themeColor][900]), 0.7);
        }
        return theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgb(77, 77, 77)';
      },
    },
  };
});

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

        if (!active) {
          template.splice(1, 0, {
            label: hibernated ? `Wake Up ${getWorkspaceFriendlyName()}` : `Hibernate ${getWorkspaceFriendlyName()}`,
            click: () => {
              if (hibernated) {
                return requestWakeUpWorkspace(id);
              }
              return requestHibernateWorkspace(id);
            },
          });
        }

        const menu = window.remote.Menu.buildFromTemplate(template);
        menu.popup({
          window: window.remote.getCurrentWindow(),
        });
      }}
    />
  );
});

const SortableContainer = sortableContainer(({ children }) => <div>{children}</div>);

const ScrollbarContainer = ({ children, className }) => {
  // SimpleBar brings problems on macOS
  // https://github.com/webcatalog/webcatalog-app/issues/1247
  if (window.process.platform === 'darwin') {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }

  return (
    <SimpleBar className={className}>
      {children}
    </SimpleBar>
  );
};

ScrollbarContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string.isRequired,
};

const Sidebar = ({
  isFullScreen,
  isLoading,
  muteApp,
  navigationBar,
  shouldPauseNotifications,
  sidebarAddButton,
  sidebarSize,
  themeColor,
  titleBar,
  workspaces,
}) => {
  const classes = useStyles({ themeColor });
  const appJson = getStaticGlobal('appJson');
  const workspacesList = getWorkspacesAsList(workspaces);
  const showMacTitleBar = window.process.platform === 'darwin' && titleBar && !isFullScreen;
  const isSidebarExpanded = sidebarSize === 'expanded';
  const rtl = getStaticGlobal('rtlCoordination');

  return (
    <ScrollbarContainer
      className={classnames(
        classes.sidebarUpperRoot,
        isSidebarExpanded && classes.sidebarUpperRootWide,
        rtl ? classes.sidebarUpperRootRight : classes.sidebarUpperRootLeft,
      )}
    >
      <div className={classes.sidebarRoot}>
        {window.process.platform === 'darwin' && !isFullScreen && !showMacTitleBar && (
          <div
            className={classnames(
              classes.sidebarDraggableArea,
              navigationBar && classes.sidebarDraggableAreaWithNavigationBar,
            )}
          />
        )}
        <div className={classes.sidebarTop}>
          <SortableContainer
            distance={10}
            helperClass={classes.grabbing}
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

                const menu = window.remote.Menu.buildFromTemplate(template);
                menu.popup({
                  window: window.remote.getCurrentWindow(),
                });
              }}
            />
          )}
        </div>
        {!navigationBar && !isMas() && !isAppx() && (
          <BrowserActionList className={classes.browserActionList} />
        )}
        {!navigationBar && (
        <div
          className={classnames(classes.end, isSidebarExpanded && classes.endExpanded)}
        >
          {!titleBar && isLoading && (
            <div className={classes.progressContainer}>
              <CircularProgress size={20} className={classes.progress} />
            </div>
          )}
          <RatingButton
            className={classnames(
              classes.iconButton,
              !isSidebarExpanded && classes.iconButtonVertical,
            )}
            size="small"
          />
          {window.process.platform === 'darwin' && (
            <IconButton
              title="Share"
              aria-label="Share"
              onClick={() => requestShowShareMenu()}
              classes={{
                root: classnames(
                  classes.iconButton,
                  !isSidebarExpanded && classes.iconButtonVertical,
                ),
                disabled: classes.iconButtonDisabled,
              }}
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
            classes={{
              root: classnames(
                classes.iconButton,
                !isSidebarExpanded && classes.iconButtonVertical,
              ),
              disabled: classes.iconButtonDisabled,
            }}
            size="small"
          >
            {shouldPauseNotifications ? <NotificationsPausedIcon /> : <NotificationsIcon />}
          </IconButton>
          <IconButton
            title={muteApp ? 'Unmute' : 'Mute'}
            aria-label={muteApp ? 'Unmute' : 'Mute'}
            onClick={() => requestSetPreference('muteApp', !muteApp)}
            classes={{
              root: classnames(
                classes.iconButton,
                !isSidebarExpanded && classes.iconButtonVertical,
              ),
              disabled: classes.iconButtonDisabled,
            }}
            size="small"
          >
            {muteApp ? <VolumeOffIcon /> : <VolumeUpIcon />}
          </IconButton>
          <IconButton
            title="Preferences"
            aria-label="Preferences"
            onClick={() => requestShowPreferencesWindow()}
            classes={{
              root: classnames(
                classes.iconButton,
                !isSidebarExpanded && classes.iconButtonVertical,
              ),
              disabled: classes.iconButtonDisabled,
            }}
            size="small"
          >
            <SettingsIcon />
          </IconButton>
        </div>
        )}
      </div>
    </ScrollbarContainer>
  );
};

Sidebar.defaultProps = {
  isLoading: false,
  themeColor: null,
};

Sidebar.propTypes = {
  isFullScreen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  muteApp: PropTypes.bool.isRequired,
  navigationBar: PropTypes.bool.isRequired,
  shouldPauseNotifications: PropTypes.bool.isRequired,
  sidebarAddButton: PropTypes.bool.isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  themeColor: PropTypes.string,
  titleBar: PropTypes.bool.isRequired,
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const activeWorkspace = state.workspaces.workspaces[state.workspaces.activeWorkspaceId];

  return {
    isFullScreen: state.general.isFullScreen,
    isLoading: activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading)
      : false,
    navigationBar: (window.process.platform === 'linux'
      && state.preferences.attachToMenubar
      && !state.preferences.sidebar)
      || state.preferences.navigationBar,
    shouldPauseNotifications: state.notifications.pauseNotificationsInfo !== null,
    sidebarAddButton: state.preferences.sidebarAddButton,
    sidebarSize: state.preferences.sidebarSize,
    titleBar: state.preferences.titleBar,
    muteApp: state.preferences.muteApp,
    workspaces: state.workspaces.workspaces,
    themeColor: (() => {
      if (state.preferences.themeColor === 'auto') {
        if (activeWorkspace && activeWorkspace.preferences && activeWorkspace.preferences.color) {
          return activeWorkspace.preferences.color;
        }
        return null;
      }
      return state.preferences.themeColor;
    })(),
  };
};

export default connectComponent(
  Sidebar,
  mapStateToProps,
);
