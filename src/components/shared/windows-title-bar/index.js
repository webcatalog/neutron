/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import { getCurrentWindow } from '@electron/remote';

import { alpha } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import { useSelector } from 'react-redux';

import MenuIcon from '@mui/icons-material/Menu';

import { Box, Button } from '@mui/material';

import { requestShowAppMenu } from '../../../senders';

import getStaticGlobal from '../../../helpers/get-static-global';

import themeColors from '../../../constants/theme-colors';

import NavigationButtons from '../navigation-buttons';

const TOOLBAR_HEIGHT = 28;
const BUTTON_WIDTH = 46;

const EnhancedAppBar = ({ title: _title }) => {
  const appJson = getStaticGlobal('appJson');

  const activeWorkspace = useSelector(
    (state) => state.workspaces.workspaces[state.workspaces.activeWorkspaceId],
  );
  const isMaximized = useSelector((state) => state.general.isMaximized);
  const title = useSelector((state) => _title || ((window.mode === 'main' || window.mode === 'menubar') && state.general.title ? state.general.title : appJson.name));
  const sidebar = useSelector((state) => state.preferences.sidebar);
  const sidebarSize = useSelector((state) => state.preferences.sidebarSize);
  const navigationBar = useSelector((state) => (window.process.platform === 'linux'
  && state.preferences.attachToMenubar
  && !state.preferences.sidebar)
  || state.preferences.navigationBar);
  const themeColor = useSelector((state) => {
    if (window.mode === 'main' || window.mode === 'menubar') {
      if (state.preferences.themeColor === 'auto') {
        if (activeWorkspace && activeWorkspace.preferences && activeWorkspace.preferences.color) {
          return activeWorkspace.preferences.color;
        }
        return null;
      }
      return state.preferences.themeColor;
    }
    return null;
  });

  const onDoubleClick = (e) => {
    // feature: double click on title bar to expand #656
    // https://github.com/webcatalog/webcatalog-app/issues/656
    // https://stackoverflow.com/questions/10554446/no-onclick-when-child-is-clicked
    if (e.target === e.currentTarget) {
      const win = getCurrentWindow();
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        // leave space for resizing cursor
        // https://github.com/electron/electron/issues/3022
        p: 0.125,
        background: (theme) => {
          if (themeColor != null) {
            return themeColors[themeColor][900];
          }
          return theme.palette.mode === 'dark' ? undefined : theme.palette.grey[300];
        },
        color: (theme) => {
          if (themeColor != null) {
            return alpha(theme.palette.getContrastText(themeColors[themeColor][900]), 0.7);
          }
          return theme.palette.text.secondary;
        },
      }}
      color="default"
      elevation={0}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: TOOLBAR_HEIGHT,
          height: TOOLBAR_HEIGHT,
          px: '0 !important',
          display: 'flex',
          WebkitAppRegion: 'drag',
          userSelect: 'none',
        }}
      >
        <Box
          sx={{
            // leave space for traffic light buttons
            pl: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 0,
            boxSizing: 'border-box',
          }}
          onDoubleClick={onDoubleClick}
        >
          {(window.mode !== 'main' && window.mode !== 'menubar') ? null : (
            <IconButton
              size="small"
              color="inherit"
              aria-label="Menu"
              sx={[
                {
                  width: BUTTON_WIDTH,
                  borderRadius: 0,
                  height: TOOLBAR_HEIGHT,
                  '&:hover, &:focus': {
                    backgroundColor: () => {
                      if (window.process.platform === 'win32') return 'rgba(0, 0, 0, 0.04)';
                      return undefined;
                    },
                  },
                },
                sidebar && sidebarSize === 'compact' && {
                  ml: 1.125,
                  mr: 1.325,
                },
                sidebar && sidebarSize === 'expanded' && {
                  width: 36, // same as avatar img size
                  ml: 1,
                  mr: 0,
                },
                { WebkitAppRegion: 'no-drag' },
              ]}
              onClick={(e) => {
                e.stopPropagation();
                requestShowAppMenu(e.x, e.y);
              }}
              disableRipple
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}
          {window.mode === 'main' && !navigationBar && (
            <NavigationButtons />
          )}
        </Box>
        <Box
          sx={{
            flex: 1,
            fontSize: '0.8rem',
            height: TOOLBAR_HEIGHT,
            lineHeight: `${TOOLBAR_HEIGHT}px`,
            color: 'inherit',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            px: 1,
          }}
          onDoubleClick={onDoubleClick}
        >
          {title}
        </Box>
        <Box
          sx={{
            textAlign: 'right',
            boxSizing: 'border-box',
          }}
          onDoubleClick={onDoubleClick}
        >
          {!getStaticGlobal('useSystemWindowButtons') && (
            <Box
              sx={{
                verticalAlign: 'middle',
                display: 'inline-block',
                height: TOOLBAR_HEIGHT,
                ml: 0,
              }}
            >
              <Button
                sx={{
                  minWidth: 46.5,
                  display: 'inline-block',
                  WebkitAppRegion: 'no-drag',
                  height: 1,
                  width: BUTTON_WIDTH,
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  p: 0,
                  m: 0,
                  '&:hover': {
                    bgcolor: () => {
                      if (themeColor != null) {
                        return themeColors[themeColor][800];
                      }
                      return (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.grey[400]);
                    },
                  },
                }}
                type="button"
                tabIndex="-1" // normally, windows buttons is not navigable by keyboard
                aria-label="Minimize"
                onClick={(e) => {
                  e.stopPropagation();
                  const browserWindow = getCurrentWindow();
                  if (window.mode === 'menubar') {
                    browserWindow.hide();
                  } else {
                    browserWindow.minimize();
                  }
                }}
              >
                <Box
                  sx={{
                    height: 1,
                    width: 1,
                    maskSize: '23.1%',
                    backgroundColor: (theme) => {
                      if (themeColor != null) {
                        // eslint-disable-next-line max-len
                        return alpha(theme.palette.getContrastText(themeColors[themeColor][900]), 0.7);
                      }
                      return theme.palette.text.secondary;
                    },
                    cursor: 'pointer',
                    mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 4.399V5.5H0V4.399h11z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
                  }}
                />
              </Button>
              {window.mode === 'main' && (
                <Button
                  sx={{
                    minWidth: 46.5,
                    display: 'inline-block',
                    WebkitAppRegion: 'no-drag',
                    height: 1,
                    width: BUTTON_WIDTH,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    p: 0,
                    m: 0,
                    '&:hover': {
                      bgcolor: () => {
                        if (themeColor != null) {
                          return themeColors[themeColor][800];
                        }
                        return (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.grey[400]);
                      },
                    },
                  }}
                  type="button"
                  tabIndex="-1" // normally, windows buttons is not navigable by keyboard
                  aria-label={isMaximized ? 'Unmaximize' : 'Maximize'}
                  onClick={(e) => {
                    e.stopPropagation();
                    const browserWindow = getCurrentWindow();
                    if (browserWindow.isMaximized()) {
                      browserWindow.unmaximize();
                    } else {
                      browserWindow.maximize();
                    }
                  }}
                >
                  <Box
                    sx={[
                      {
                        height: 1,
                        width: 1,
                        maskSize: '23.1%',
                        bgcolor: (theme) => {
                          if (themeColor != null) {
                            // eslint-disable-next-line max-len
                            return alpha(theme.palette.getContrastText(themeColors[themeColor][900]), 0.7);
                          }
                          return theme.palette.text.secondary;
                        },
                        cursor: 'pointer',
                      },
                      isMaximized && {
                        mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 8.798H8.798V11H0V2.202h2.202V0H11v8.798zm-3.298-5.5h-6.6v6.6h6.6v-6.6zM9.9 1.1H3.298v1.101h5.5v5.5h1.1v-6.6z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
                      },
                      !isMaximized && {
                        mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 0v11H0V0h11zM9.899 1.101H1.1V9.9h8.8V1.1z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
                      },
                    ]}
                  />
                </Button>
              )}
              {window.mode !== 'menubar' && (
                <Button
                  sx={{
                    minWidth: 46.5,
                    display: 'inline-block',
                    WebkitAppRegion: 'no-drag',
                    height: 1,
                    width: BUTTON_WIDTH,
                    background: 'none',
                    border: 'none',
                    outline: 'none',
                    p: 0,
                    m: 0,
                    '&:hover': {
                      bgcolor: () => {
                        if (themeColor != null) {
                          return themeColors[themeColor][800];
                        }
                        return (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.grey[400]);
                      },
                    },
                  }}
                  type="button"
                  tabIndex="-1" // normally, windows buttons is not navigable by keyboard
                  aria-label={isMaximized ? 'Unmaximize' : 'Maximize'}
                  onClick={(e) => {
                    e.stopPropagation();
                    const browserWindow = getCurrentWindow();
                    browserWindow.close();
                  }}
                >
                  <Box
                    sx={{
                      height: 1,
                      width: 1,
                      maskSize: '23.1%',
                      backgroundColor: (theme) => {
                        if (themeColor != null) {
                          // eslint-disable-next-line max-len
                          return alpha(theme.palette.getContrastText(themeColors[themeColor][900]), 0.7);
                        }
                        return theme.palette.text.secondary;
                      },
                      cursor: 'pointer',
                      mask: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='11' height='11' viewBox='0 0 11 11' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6.279 5.5L11 10.221l-.779.779L5.5 6.279.779 11 0 10.221 4.721 5.5 0 .779.779 0 5.5 4.721 10.221 0 11 .779 6.279 5.5z' fill='%23000'/%3E%3C/svg%3E\") no-repeat 50% 50%",
                    }}
                  />
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

EnhancedAppBar.defaultProps = {
  title: '',
};

EnhancedAppBar.propTypes = {
  title: PropTypes.string,
};

export default EnhancedAppBar;
