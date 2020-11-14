/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import SettingsIcon from '@material-ui/icons/Settings';

import { sortableContainer, sortableElement } from 'react-sortable-hoc';

import connectComponent from '../../helpers/connect-component';
import getWorkspacesAsList from '../../helpers/get-workspaces-as-list';

import arrowWhite from '../../images/arrow-white.png';
import arrowBlack from '../../images/arrow-black.png';

import WorkspaceSelector from './workspace-selector';
import FindInPage from './find-in-page';
import NavigationBar from './navigation-bar';
import MacTitleBar from './mac-title-bar';
import DraggableRegion from './draggable-region';
import TelemetryManager from './telemetry-manager';

import {
  requestCreateWorkspace,
  requestHibernateWorkspace,
  requestRemoveWorkspace,
  requestSetActiveWorkspace,
  requestSetWorkspaces,
  requestShowAddWorkspaceWindow,
  requestShowEditWorkspaceWindow,
  requestShowNotificationsWindow,
  requestShowPreferencesWindow,
  requestShowWorkspacePreferencesWindow,
  requestWakeUpWorkspace,
  requestReload,
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

const styles = (theme) => {
  // big sur increases title bar height
  const titleBarHeight = window.remote.getGlobal('isMacOs11') ? 28 : 22;

  return {
    outerRoot: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
    root: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      height: '100%',
      width: '100%',
      overflow: 'hidden',
    },
    sidebarUpperRoot: {
      height: '100%',
      width: 68,
      backgroundColor: theme.palette.background.paper,
      WebkitAppRegion: window.process.platform === 'darwin' ? 'drag' : 'no-drag',
      borderRight: '1px solid',
      borderRightColor: theme.palette.divider,
      WebkitUserSelect: 'none',
      overflowX: 'hidden',
    },
    sidebarUpperRootWide: {
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
    sidebarTop: {
      flex: 1,
      paddingTop: window.process.platform === 'darwin' ? titleBarHeight : 0,
      width: '100%',
    },
    sidebarTopFullScreen: {
      paddingTop: 0,
    },
    innerContentRoot: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing(1),
    },
    contentRoot: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    arrow: {
      height: 202,
      width: 150,
      position: 'absolute',
      top: window.process.platform === 'darwin' ? 50 : 60,
      left: 72,
      backgroundImage: `url('${theme.palette.type === 'dark' ? arrowWhite : arrowBlack}')`,
      backgroundSize: '150px 202px',
    },
    avatar: {
      fontFamily: theme.typography.fontFamily,
      display: 'inline-block',
      height: 36,
      width: 36,
      background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
      borderRadius: 4,
      color: theme.palette.getContrastText(theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
      lineHeight: '36px',
      textAlign: 'center',
      fontWeight: 400,
      textTransform: 'uppercase',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
      fontSize: '24px',
    },
    inlineBlock: {
      display: 'inline-block',
      fontSize: '18px',
      color: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    },
    tip: {
      position: 'absolute',
      top: 112,
      left: 180,
      fontFamily: theme.typography.fontFamily,
      userSelect: 'none',
    },
    tip2: {
      fontFamily: theme.typography.fontFamily,
      userSelect: 'none',
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
    ul: {
      marginTop: 0,
      marginBottom: '1.5rem',
    },
    iconButton: {
      width: '100%',
      borderRadius: 0,
    },
  };
};

const SortableItem = sortableElement(({ value }) => {
  const { workspace, index } = value;
  const {
    active, id, name, picturePath, hibernated, transparentBackground,
  } = workspace;
  return (
    <WorkspaceSelector
      active={active}
      id={id}
      key={id}
      name={name}
      picturePath={picturePath}
      transparentBackground={transparentBackground}
      order={index}
      hibernated={hibernated}
      onClick={() => requestSetActiveWorkspace(id)}
      onContextMenu={(e) => {
        e.preventDefault();

        const template = [
          {
            label: 'Edit Workspace',
            click: () => requestShowEditWorkspaceWindow(id),
          },
          {
            label: 'Configure Workspace',
            click: () => requestShowWorkspacePreferencesWindow(id),
          },
          {
            label: 'Remove Workspace',
            click: () => requestRemoveWorkspace(id),
          },
        ];

        if (!active) {
          template.splice(1, 0, {
            label: hibernated ? 'Wake Up Workspace' : 'Hibernate Workspace',
            click: () => {
              if (hibernated) {
                return requestWakeUpWorkspace(id);
              }
              return requestHibernateWorkspace(id);
            },
          });
        }

        const menu = window.remote.Menu.buildFromTemplate(template);
        menu.popup(window.remote.getCurrentWindow());
      }}
    />
  );
});

const SortableContainer = sortableContainer(({ children }) => <div>{children}</div>);

const Main = ({
  classes,
  didFailLoad,
  isFullScreen,
  isLoading,
  navigationBar,
  shouldPauseNotifications,
  sidebar,
  titleBar,
  workspaces,
}) => {
  const appJson = window.remote.getGlobal('appJson');
  const workspacesList = getWorkspacesAsList(workspaces);
  const showMacTitleBar = window.process.platform === 'darwin' && titleBar && !isFullScreen;

  return (
    <div className={classes.outerRoot}>
      {showMacTitleBar && <MacTitleBar />}
      <DraggableRegion />
      <div className={classes.root}>
        {sidebar && (
          <SimpleBar
            className={classes.sidebarUpperRoot}
          >
            <div className={classes.sidebarRoot}>
              <div className={classnames(classes.sidebarTop,
                (isFullScreen || showMacTitleBar || window.mode === 'menubar') && classes.sidebarTopFullScreen)}
              >
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
                    <SortableItem key={`item-${workspace.id}`} index={i} value={{ index: i, workspace }} />
                  ))}
                </SortableContainer>
                <WorkspaceSelector
                  id="add"
                  onClick={!appJson.url
                    ? () => requestShowAddWorkspaceWindow()
                    : () => requestCreateWorkspace()}
                  onContextMenu={!appJson.url ? null : (e) => {
                    e.preventDefault();
                    const template = [
                      {
                        label: `Add ${appJson.name} Workspace`,
                        click: () => requestCreateWorkspace(),
                      },
                      {
                        label: 'Add Custom Workspace',
                        click: () => requestShowAddWorkspaceWindow(),
                      },
                    ];

                    const menu = window.remote.Menu.buildFromTemplate(template);
                    menu.popup(window.remote.getCurrentWindow());
                  }}
                />
              </div>
              {!navigationBar && (
              <div className={classes.end}>
                <IconButton
                  aria-label="Notifications"
                  onClick={requestShowNotificationsWindow}
                  className={classes.iconButton}
                  size="small"
                >
                  {shouldPauseNotifications ? <NotificationsPausedIcon /> : <NotificationsIcon />}
                </IconButton>
                <IconButton
                  aria-label="Preferences"
                  onClick={() => requestShowPreferencesWindow()}
                  className={classes.iconButton}
                  size="small"
                >
                  <SettingsIcon />
                </IconButton>
              </div>
              )}
            </div>
          </SimpleBar>
        )}
        <div className={classes.contentRoot}>
          {navigationBar && <NavigationBar />}
          <FindInPage />
          <div className={classes.innerContentRoot}>
            {didFailLoad && !isLoading && (
              <div>
                <Typography align="left" variant="h5">
                  This site can’t be reached.
                </Typography>
                <Typography align="left" variant="body2">
                  {didFailLoad}
                </Typography>

                <br />
                <Typography align="left" variant="body2">
                  <>
                    Try:
                    <ul className={classes.ul}>
                      <li>Checking the network cables, modem, and router.</li>
                      <li>Checking the proxy and the firewall.</li>
                      <li>Reconnecting to Wi-Fi.</li>
                    </ul>
                  </>
                </Typography>

                <Button variant="outlined" onClick={requestReload}>
                  Reload
                </Button>
              </div>
            )}
            {isLoading && (
              <Typography type="body1" color="textSecondary">
                Loading...
              </Typography>
            )}
            {Object.keys(workspaces).length < 1 && (
              <div>
                {sidebar ? (
                  <>
                    <div alt="Arrow" className={classes.arrow} />
                    <div className={classes.tip}>
                      <span className={classes.inlineBlock}>Click</span>
                      <div className={classes.avatar}>
                        +
                      </div>
                      <span className={classes.inlineBlock}>to get started!</span>
                    </div>
                  </>
                ) : (
                  <div className={classes.tip2}>
                    <span className={classes.inlineBlock}>
                      <span>Click </span>
                      <strong>Workspaces &gt; Add Workspace</strong>
                      <span> to get started!</span>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <TelemetryManager />
    </div>
  );
};

Main.defaultProps = {
  didFailLoad: null,
  isLoading: false,
};

Main.propTypes = {
  classes: PropTypes.object.isRequired,
  didFailLoad: PropTypes.string,
  isFullScreen: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  navigationBar: PropTypes.bool.isRequired,
  shouldPauseNotifications: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  titleBar: PropTypes.bool.isRequired,
  workspaces: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  const activeWorkspace = Object.values(state.workspaces)
    .find((workspace) => workspace.active);

  return {
    didFailLoad: activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? state.workspaceMetas[activeWorkspace.id].didFailLoad
      : null,
    isFullScreen: state.general.isFullScreen,
    isLoading: activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading)
      : false,
    navigationBar: (window.process.platform === 'linux'
      && state.preferences.attachToMenubar
      && !state.preferences.sidebar)
      || state.preferences.navigationBar,
    shouldPauseNotifications: state.notifications.pauseNotificationsInfo !== null,
    sidebar: state.preferences.sidebar,
    titleBar: state.preferences.titleBar,
    workspaces: state.workspaces,
  };
};

export default connectComponent(
  Main,
  mapStateToProps,
  null,
  styles,
);
