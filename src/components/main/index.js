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
import SvgIcon from '@material-ui/core/SvgIcon';

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
import isMacOs11 from '../../helpers/is-mac-os-11';
import isMas from '../../helpers/is-mas';

import arrowWhite from '../../images/arrow-white.png';
import arrowBlack from '../../images/arrow-black.png';

import WorkspaceSelector from './workspace-selector';
import FindInPage from './find-in-page';
import NavigationBar from './navigation-bar';
import MacTitleBar from './mac-title-bar';
import DraggableRegion from './draggable-region';
import TelemetryManager from './telemetry-manager';
import RatingButton from './rating-button';

import {
  requestCreateWorkspace,
  requestHibernateWorkspace,
  requestReload,
  requestRemoveWorkspace,
  requestSetActiveWorkspace,
  requestSetPreference,
  requestSetWorkspace,
  requestSetWorkspaces,
  requestShowAddWorkspaceWindow,
  requestShowEditWorkspaceWindow,
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

const styles = (theme) => {
  // big sur increases title bar height
  const titleBarHeight = isMacOs11() ? 28 : 22;

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
      width: '100%',
      overflow: 'hidden',
    },
    sidebarUpperRoot: {
      display: 'flex',
      height: '100%',
      width: 68,
      backgroundColor: theme.palette.background.paper,
      borderRight: '1px solid',
      borderRightColor: theme.palette.divider,
      overflowX: 'hidden',
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
      height: titleBarHeight,
      minHeight: titleBarHeight,
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
      left: 76,
      backgroundImage: `url('${theme.palette.type === 'dark' ? arrowWhite : arrowBlack}')`,
      backgroundSize: '150px 202px',
    },
    arrowWithNavBar: {
      top: window.process.platform === 'darwin' ? 80 : 90,
    },
    arrowExpanded: {
      left: 264,
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
      whiteSpace: 'nowrap',
    },
    tip: {
      position: 'absolute',
      top: 112,
      left: 180,
      fontFamily: theme.typography.fontFamily,
      userSelect: 'none',
    },
    tipExpanded: {
      left: 368,
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
    endExpanded: {
      display: 'block',
      padding: theme.spacing(1),
    },
    ul: {
      marginTop: 0,
      marginBottom: '1.5rem',
    },
    iconButton: {
      width: '100%',
      borderRadius: 0,
    },
    browserActionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.5),
    },
  };
};

const SortableItem = sortableElement(({ value }) => {
  const { workspace, index } = value;
  const {
    accountInfo,
    active,
    backgroundColor,
    disableAudio,
    disableNotifications,
    hibernated,
    id,
    name,
    picturePath,
    preferredIconType,
    transparentBackground,
  } = workspace;

  return (
    <WorkspaceSelector
      active={active}
      id={id}
      key={id}
      name={name}
      accountInfo={accountInfo}
      picturePath={picturePath}
      backgroundColor={backgroundColor}
      transparentBackground={transparentBackground}
      preferredIconType={preferredIconType}
      order={index}
      hibernated={hibernated}
      onClick={() => requestSetActiveWorkspace(id)}
      onContextMenu={(e) => {
        e.preventDefault();

        const template = [
          {
            label: `Edit ${getWorkspaceFriendlyName()}`,
            click: () => requestShowEditWorkspaceWindow(id),
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
        menu.popup(window.remote.getCurrentWindow());
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

const Main = ({
  classes,
  didFailLoad,
  isFullScreen,
  isLoading,
  muteApp,
  navigationBar,
  shouldPauseNotifications,
  sidebar,
  sidebarSize,
  titleBar,
  workspaces,
}) => {
  const appJson = getStaticGlobal('appJson');
  const workspacesList = getWorkspacesAsList(workspaces);
  const showMacTitleBar = window.process.platform === 'darwin' && titleBar && !isFullScreen;
  const isSidebarExpanded = sidebarSize === 'expanded';

  return (
    <div className={classes.outerRoot}>
      {showMacTitleBar && <MacTitleBar />}
      <DraggableRegion />
      <div className={classes.root}>
        {sidebar && (
          <ScrollbarContainer
            className={classnames(
              classes.sidebarUpperRoot,
              isSidebarExpanded && classes.sidebarUpperRootWide,
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
                    <SortableItem key={`item-${workspace.id}`} index={i} value={{ index: i, workspace }} />
                  ))}
                </SortableContainer>
                <WorkspaceSelector
                  id="add"
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
                    menu.popup(window.remote.getCurrentWindow());
                  }}
                />
              </div>
              {!navigationBar && !isMas() && <browser-action-list partition="persist:shared" direction="column" class={classes.browserActionList} />}
              {!navigationBar && (
              <div
                className={classnames(classes.end, isSidebarExpanded && classes.endExpanded)}
              >
                <RatingButton
                  className={classnames(!isSidebarExpanded && classes.iconButton)}
                  size="small"
                />
                {window.process.platform === 'darwin' && workspacesList.length > 0 && (
                  <IconButton
                    title="Share"
                    aria-label="Share"
                    onClick={() => requestShowShareMenu()}
                    className={classnames(!isSidebarExpanded && classes.iconButton)}
                    size="small"
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
                  className={classnames(!isSidebarExpanded && classes.iconButton)}
                  size="small"
                >
                  {shouldPauseNotifications ? <NotificationsPausedIcon /> : <NotificationsIcon />}
                </IconButton>
                <IconButton
                  title={muteApp ? 'Unmute' : 'Mute'}
                  aria-label={muteApp ? 'Unmute' : 'Mute'}
                  onClick={() => requestSetPreference('muteApp', !muteApp)}
                  className={classnames(!isSidebarExpanded && classes.iconButton)}
                  size="small"
                >
                  {muteApp ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
                <IconButton
                  title="Preferences"
                  aria-label="Preferences"
                  onClick={() => requestShowPreferencesWindow()}
                  className={classnames(!isSidebarExpanded && classes.iconButton)}
                  size="small"
                >
                  <SettingsIcon />
                </IconButton>
              </div>
              )}
            </div>
          </ScrollbarContainer>
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
                      <li>Checking the VPN, the proxy and the firewall configurations.</li>
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
                    <div
                      alt="Arrow"
                      className={classnames(
                        classes.arrow,
                        navigationBar && classes.arrowWithNavBar,
                        isSidebarExpanded && classes.arrowExpanded,
                      )}
                    />
                    <div
                      className={classnames(
                        classes.tip,
                        isSidebarExpanded && classes.tipExpanded,
                      )}
                    >
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
                      <strong>{`${getWorkspaceFriendlyName(true)} > Add ${getWorkspaceFriendlyName()}`}</strong>
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
  muteApp: PropTypes.bool.isRequired,
  navigationBar: PropTypes.bool.isRequired,
  shouldPauseNotifications: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
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
    sidebarSize: state.preferences.sidebarSize,
    titleBar: state.preferences.titleBar,
    muteApp: state.preferences.muteApp,
    workspaces: state.workspaces,
  };
};

export default connectComponent(
  Main,
  mapStateToProps,
  null,
  styles,
);
