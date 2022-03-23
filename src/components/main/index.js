/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import classnames from 'classnames';

import makeStyles from '@mui/styles/makeStyles';

import 'simplebar/dist/simplebar.min.css';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useSelector } from 'react-redux';

import getStaticGlobal from '../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import arrowWhite from '../../images/arrow-white.png';
import arrowBlack from '../../images/arrow-black.png';

import FindInPage from './find-in-page';
import NavigationBar from './navigation-bar';
import MacTitleBar from './mac-title-bar';
import DraggableRegion from './draggable-region';
import TelemetryManager from './telemetry-manager';
import Sidebar from './sidebar';

import {
  requestReload,
} from '../../senders';

import './main.css';
import TabBar from './tab-bar';

const useStyles = makeStyles((theme) => ({
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
  rootRtl: {
    flexDirection: 'row-reverse',
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
  contentRootActive: {
    // background should always be set to #fff (for web compatiblity)
    // if not, by default, the background of BrowserView is transparent
    // which would break the CSS of certain websites
    // even with dark mode, all major browsers
    // always use #FFF as default page background
    // https://github.com/webcatalog/webcatalog-app/issues/723
    // https://github.com/electron/electron/issues/16212
    background: theme.palette.common.white,
  },
  arrow: {
    height: 202,
    width: 150,
    position: 'absolute',
    top: window.process.platform === 'darwin' ? 50 : 60,
    backgroundImage: `url('${theme.palette.mode === 'dark' ? arrowWhite : arrowBlack}')`,
    backgroundSize: '150px 202px',
  },
  arrowWithNavBar: {
    top: window.process.platform === 'darwin' ? 80 : 90,
  },
  arrowLeft: {
    left: 76,
  },
  arrowLeftExpanded: {
    left: 264,
  },
  arrowRight: {
    transform: 'rotate(90deg)',
    right: 120,
  },
  arrowRightExpanded: {
    transform: 'rotate(90deg)',
    right: 300,
  },
  avatar: {
    fontFamily: theme.typography.fontFamily,
    display: 'inline-block',
    height: 36,
    width: 36,
    background: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
    lineHeight: '36px',
    textAlign: 'center',
    fontWeight: 400,
    textTransform: 'uppercase',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    border: theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    fontSize: '24px',
  },
  inlineBlock: {
    display: 'inline-block',
    fontSize: '18px',
    color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    whiteSpace: 'nowrap',
  },
  tip: {
    position: 'absolute',
    fontFamily: theme.typography.fontFamily,
    userSelect: 'none',
  },
  tipLeft: {
    top: 112,
    left: 180,
  },
  tipLeftExpanded: {
    top: 112,
    left: 368,
  },
  tipRight: {
    top: 80,
    right: 220,
  },
  tipRightExpanded: {
    right: 400,
  },
  ul: {
    marginTop: 0,
    marginBottom: '1.5rem',
  },
  tipWithoutArrow: {
    fontFamily: theme.typography.fontFamily,
    userSelect: 'none',
  },
}));

const Main = () => {
  const activeWorkspace = useSelector(
    (state) => state.workspaces.workspaces[state.workspaces.activeWorkspaceId],
  );

  const didFailLoad = useSelector(
    (state) => (activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? state.workspaceMetas[activeWorkspace.id].didFailLoad
      : null
    ),
  );

  const isFullScreen = useSelector((state) => state.general.isFullScreen);
  const isLoading = useSelector((state) => (
    activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading)
      : false));
  const navigationBar = useSelector((state) => (
    (window.process.platform === 'linux'
    && state.preferences.attachToMenubar
    && !state.preferences.sidebar)
    || state.preferences.navigationBar));
  const sidebar = useSelector((state) => state.preferences.sidebar);
  const sidebarAddButton = useSelector((state) => state.preferences.sidebarAddButton);
  const sidebarSize = useSelector((state) => state.preferences.sidebarSize);
  const titleBar = useSelector((state) => state.preferences.titleBar);
  const workspaces = useSelector((state) => state.workspaces.workspaces);
  const themeColor = useSelector((state) => {
    if (state.preferences.themeColor === 'auto') {
      if (activeWorkspace && activeWorkspace.preferences && activeWorkspace.preferences.color) {
        return activeWorkspace.preferences.color;
      }
      return null;
    }
    return state.preferences.themeColor;
  });

  const classes = useStyles({ themeColor });

  const appJson = getStaticGlobal('appJson');
  const showMacTitleBar = window.process.platform === 'darwin' && titleBar && !isFullScreen;
  const isSidebarExpanded = sidebarSize === 'expanded';
  const rtl = getStaticGlobal('rtlCoordination');
  const useTabs = getStaticGlobal('useTabs');
  const hasWorkspaces = Object.keys(workspaces).length > 0;

  return (
    <div className={classes.outerRoot}>
      {showMacTitleBar && <MacTitleBar themeColor={themeColor} />}
      <DraggableRegion />
      <div className={classnames(classes.root, rtl && classes.rootRtl)}>
        {sidebar && <Sidebar />}
        <div
          className={classnames(
            classes.contentRoot,
            hasWorkspaces && !didFailLoad && classes.contentRootActive,
          )}
        >
          {useTabs && <TabBar themeColor={themeColor} />}
          {navigationBar && <NavigationBar themeColor={themeColor} />}
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
                <Typography align="left" variant="body2" component="div">
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
            {!hasWorkspaces && (
              <div>
                {sidebar && sidebarAddButton ? (
                  <>
                    <div
                      alt="Arrow"
                      className={classnames(
                        classes.arrow,
                        navigationBar && classes.arrowWithNavBar,
                        rtl ? classes.arrowRight : classes.arrowLeft,
                        isSidebarExpanded && (
                          rtl ? classes.arrowRightExpanded : classes.arrowLeftExpanded),
                      )}
                    />
                    <div
                      className={classnames(
                        classes.tip,
                        rtl ? classes.tipRight : classes.tipLeft,
                        isSidebarExpanded && (
                          rtl ? classes.tipRightExpanded : classes.tipLeftExpanded
                        ),
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
                  <div className={classes.tipWithoutArrow}>
                    <span className={classes.inlineBlock}>
                      <span>Click </span>
                      {appJson.url ? (
                        <strong>{`${getWorkspaceFriendlyName(true)} > Add ${appJson.name} ${getWorkspaceFriendlyName()}`}</strong>
                      ) : (
                        <strong>{`${getWorkspaceFriendlyName(true)} > Add ${getWorkspaceFriendlyName()}`}</strong>
                      )}
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

export default Main;
