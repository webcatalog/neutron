/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import 'simplebar/dist/simplebar.min.css';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

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

  const appJson = getStaticGlobal('appJson');
  const showMacTitleBar = window.process.platform === 'darwin' && titleBar && !isFullScreen;
  const isSidebarExpanded = sidebarSize === 'expanded';
  const rtl = getStaticGlobal('rtlCoordination');
  const useTabs = getStaticGlobal('useTabs');
  const hasWorkspaces = Object.keys(workspaces).length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 1,
        width: 1,
        overflow: 'hidden',
      }}
    >
      {showMacTitleBar && <MacTitleBar themeColor={themeColor} />}
      <DraggableRegion />
      <Box
        sx={[
          {
            display: 'flex',
            flexDirection: 'row',
            flex: 1,
            width: 1,
            overflow: 'hidden',
          },
          rtl && {
            flexDirection: 'row-reverse',
          },
        ]}
      >
        {sidebar && <Sidebar />}
        <Box
          sx={[
            {
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              width: 1,
            },
            hasWorkspaces && !didFailLoad && {
              // background should always be set to #fff (for web compatiblity)
              // if not, by default, the background of BrowserView is transparent
              // which would break the CSS of certain websites
              // even with dark mode, all major browsers
              // always use #FFF as default page background
              // https://github.com/webcatalog/webcatalog-app/issues/723
              // https://github.com/electron/electron/issues/16212
              background: (theme) => theme.palette.common.white,
            },
          ]}
        >
          {useTabs && <TabBar themeColor={themeColor} />}
          {navigationBar && <NavigationBar themeColor={themeColor} />}
          <FindInPage />
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            {didFailLoad && !isLoading && (
              <Box>
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
                    <ul
                      sx={{
                        mt: 0,
                        mb: '1.5rem',
                      }}
                    >
                      <li>Checking the network cables, modem, and router.</li>
                      <li>Checking the VPN, the proxy and the firewall configurations.</li>
                      <li>Reconnecting to Wi-Fi.</li>
                    </ul>
                  </>
                </Typography>

                <Button variant="outlined" onClick={requestReload}>
                  Reload
                </Button>
              </Box>
            )}
            {!hasWorkspaces && (
              <Box>
                {sidebar && sidebarAddButton ? (
                  <>
                    <Box
                      alt="Arrow"
                      sx={[
                        {
                          height: 202,
                          width: 150,
                          position: 'absolute',
                          top: window.process.platform === 'darwin' ? 50 : 60,
                          backgroundImage: (theme) => `url('${theme.palette.mode === 'dark' ? arrowWhite : arrowBlack}')`,
                          backgroundSize: '150px 202px',
                        },
                        navigationBar && {
                          top: window.process.platform === 'darwin' ? 80 : 90,
                        },
                        rtl ? {
                          transform: 'rotate(90deg)',
                          right: 120,
                        } : { left: 76 },
                        isSidebarExpanded && (
                          rtl ? {
                            transform: 'rotate(90deg)',
                            right: 300,
                          } : { left: 264 }),
                      ]}
                    />
                    <Box
                      sx={[
                        {
                          position: 'absolute',
                          fontFamily: 'fontFamily',
                          userSelect: 'none',
                        },
                        rtl ? {
                          top: 80,
                          right: 220,
                        } : {
                          top: 112,
                          left: 180,
                        },
                        isSidebarExpanded && (
                          rtl ? { right: 400 } : {
                            top: 112,
                            left: 368,
                          }
                        ),
                      ]}
                    >
                      <span
                        sx={{
                          display: 'inline-block',
                          fontSize: 18,
                          color: (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Click
                      </span>
                      <Box
                        sx={{
                          fontFamily: 'fontFamily',
                          display: 'inline-block',
                          height: 36,
                          width: 36,
                          background: (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
                          borderRadius: 4,
                          color: (theme) => theme.palette.getContrastText(theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
                          lineHeight: '36px',
                          textAlign: 'center',
                          fontWeight: 400,
                          textTransform: 'uppercase',
                          px: 1,
                          border: (theme) => (theme.palette.mode === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)'),
                          fontSize: 24,
                        }}
                      >
                        +
                      </Box>
                      <span
                        sx={{
                          display: 'inline-block',
                          fontSize: 18,
                          color: (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
                          whiteSpace: 'nowrap',
                        }}
                      >
                        to get started!
                      </span>
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      fontFamily: 'fontFamily',
                      userSelect: 'none',
                    }}
                  >
                    <span
                      sx={{
                        display: 'inline-block',
                        fontSize: 18,
                        color: (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <span>Click </span>
                      {appJson.url ? (
                        <strong>{`${getWorkspaceFriendlyName(true)} > Add ${appJson.name} ${getWorkspaceFriendlyName()}`}</strong>
                      ) : (
                        <strong>{`${getWorkspaceFriendlyName(true)} > Add ${getWorkspaceFriendlyName()}`}</strong>
                      )}
                      <span> to get started!</span>
                    </span>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <TelemetryManager />
    </Box>
  );
};

export default Main;
