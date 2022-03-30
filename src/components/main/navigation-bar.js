/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

import { alpha } from '@mui/material/styles';

import SvgIcon from '@mui/material/SvgIcon';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';

import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsPausedIcon from '@mui/icons-material/NotificationsPaused';
import SettingsIcon from '@mui/icons-material/SettingsSharp';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import getUrlFromText from '../../helpers/get-url-from-text';
import getStaticGlobal from '../../helpers/get-static-global';

import searchEngines from '../../constants/search-engines';
import themeColors from '../../constants/theme-colors';

import { updateAddressBarInfo } from '../../state/general/actions';

import {
  requestLoadUrl,
  requestSetPreference,
  requestShowNotificationsWindow,
  requestShowPreferencesWindow,
  requestShowShareMenu,
  requestShowWorkspacePreferencesWindow,
} from '../../senders';

import RatingButton from './rating-button';
import NavigationButtons from '../shared/navigation-buttons';
import isMenubarBrowser from '../../helpers/is-menubar-browser';

const NavigationBar = ({
  themeColor,
}) => {
  const dispatch = useDispatch();

  const activeWorkspaceId = useSelector((state) => state.workspaces.activeWorkspaceId);
  const address = useSelector((state) => state.general.address || '');
  const addressEdited = useSelector((state) => Boolean(state.general.addressEdited));
  const draggable = useSelector((state) => window.process.platform === 'darwin' && !state.preferences.titleBar);
  const hasTrafficLights = useSelector((state) => window.process.platform === 'darwin'
  && getStaticGlobal('windowButtons')
  && window.mode !== 'menubar'
  && !state.preferences.titleBar
  && !state.preferences.sidebar
  && !state.general.isFullScreen);
  const hasWorkspaces = useSelector((state) => Object.keys(state.workspaces.workspaces).length > 0);
  const muteApp = useSelector((state) => state.preferences.muteApp);
  const searchEngine = useSelector((state) => state.preferences.searchEngine);
  const shouldPauseNotifications = useSelector(
    (state) => state.notifications.pauseNotificationsInfo !== null,
  );
  const sidebar = useSelector((state) => state.preferences.sidebar);
  const sidebarSize = useSelector((state) => state.preferences.sidebarSize);

  const [addressInputClicked, setAddressInputClicked] = useState(false);
  const hasExpandedSidebar = sidebar && sidebarSize === 'expanded';
  const addressBarRef = useRef(null);

  useEffect(() => {
    ipcRenderer.removeAllListeners('focus-on-address-bar');
    ipcRenderer.on('focus-on-address-bar', () => {
      if (addressBarRef.current) {
        addressBarRef.current.focus();
        addressBarRef.current.select();
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('focus-on-address-bar');
    };
  }, [addressBarRef]);

  return (
    <Box
      sx={[
        {
          width: 1,
          height: 36,
          bgcolor: (theme) => {
            if (themeColor != null) {
              return themeColors[themeColor][800];
            }
            return theme.palette.background.paper;
          },
          borderBottom: (theme) => `1px solid ${theme.palette.divider} `,
          display: 'flex',
          alignItems: 'center',
          px: 1,
          WebkitUserSelect: 'none',
        },
        draggable && { WebkitAppRegion: 'drag' },
        hasTrafficLights && { pl: 8.5 },
      ]}
    >
      <Box
        sx={
          hasExpandedSidebar && {
            '@media (max-width:600px)': {
              display: 'none',
            },
          }
        }
      >
        <NavigationButtons themeColor={themeColor} />
      </Box>
      <Box
        sx={[
          {
            flex: 1,
            px: 6,
          },
          hasExpandedSidebar && {
            '@media (max-width:700px)': {
              display: 'none',
            },
          },
        ]}
      >
        <InputBase
          sx={[
            {
              width: 1,
              bgcolor: (theme) => {
                if (themeColor != null) {
                  return themeColors[themeColor][900];
                }
                return theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200];
              },
              color: (theme) => {
                if (themeColor != null) {
                  return theme.palette.getContrastText(themeColors[themeColor][800]);
                }
                return theme.palette.text.primary;
              },
              borderRadius: 0.5,
              WebkitAppRegion: 'none',
              WebkitUserSelect: 'text',
            },
            {
              '& .MuiInputBase-input': {
                fontSize: '0.8em',
                px: 2,
                py: 0.625,
              },
            },
          ]}
          placeholder={`Search on ${searchEngines[searchEngine].name} or type a URL`}
          type="text"
          value={hasWorkspaces ? address : ''}
          disabled={!hasWorkspaces}
          inputProps={{
            spellCheck: false,
            ref: addressBarRef,
          }}
          endAdornment={addressEdited && address && hasWorkspaces && (
            <IconButton
              title="Go"
              aria-label="Go"
              sx={{ p: 4 }}
              onClick={() => {
                const processedUrl = getUrlFromText(address, searchEngine);
                dispatch(updateAddressBarInfo(processedUrl, false));
                requestLoadUrl(processedUrl);
              }}
              size="large"
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          )}
          onChange={(e) => {
            dispatch(updateAddressBarInfo(e.target.value, true));
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.target.blur();
              const processedUrl = getUrlFromText(address, searchEngine);
              dispatch(updateAddressBarInfo(processedUrl, false));
              requestLoadUrl(processedUrl);
            }
          }}
          // https://stackoverflow.com/a/16659291
          onClick={(e) => {
            if (!addressInputClicked) {
              e.target.select();
              setAddressInputClicked(true);
            }
          }}
          onBlur={() => {
            setAddressInputClicked(false);
          }}
          onDrop={(e) => {
            const text = e.dataTransfer.getData('URL') || e.dataTransfer.getData('text');
            if (text) {
              e.preventDefault();
              const processedUrl = getUrlFromText(text, searchEngine);
              dispatch(updateAddressBarInfo(processedUrl, false));
              requestLoadUrl(processedUrl);
            }
          }}
        />
      </Box>
      <Box>
        <RatingButton
          sx={[
            {
              p: 6,
              WebkitAppRegion: 'no-drag',
              color: (theme) => {
                if (themeColor != null) {
                  return theme.palette.getContrastText(themeColors[themeColor][800]);
                }
                return theme.palette.text.secondary;
              },
            },
            {
              '& .Mui-disabled': {
                color: (theme) => {
                  if (themeColor != null) {
                    return `${alpha(theme.palette.getContrastText(themeColors[themeColor][800]), 0.3)} !important`;
                  }
                  return theme.palette.text.disabled;
                },
              },
            },
          ]}
          iconClassName={{ fontSize: 18 }}
        />
        {window.process.platform === 'darwin' && hasWorkspaces && (
          <IconButton
            title="Share"
            aria-label="Share"
            onClick={() => requestShowShareMenu()}
            sx={[
              {
                p: 0.725,
                WebkitAppRegion: 'no-drag',
                color: (theme) => {
                  if (themeColor != null) {
                    return theme.palette.getContrastText(themeColors[themeColor][800]);
                  }
                  return theme.palette.text.secondary;
                },
              },
              {
                '& .Mui-disabled': {
                  color: (theme) => {
                    if (themeColor != null) {
                      return `${alpha(theme.palette.getContrastText(themeColors[themeColor][800]), 0.3)} !important`;
                    }
                    return theme.palette.text.disabled;
                  },
                },
              },
            ]}
            size="small"
          >
            <SvgIcon sx={{ fontSize: 18 }}>
              <path fill="currentColor" d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z" />
            </SvgIcon>
          </IconButton>
        )}
        <IconButton
          title="Notifications"
          aria-label="Notifications"
          onClick={requestShowNotificationsWindow}
          sx={[
            {
              p: 0.725,
              WebkitAppRegion: 'no-drag',
              color: (theme) => {
                if (themeColor != null) {
                  return theme.palette.getContrastText(themeColors[themeColor][800]);
                }
                return theme.palette.text.secondary;
              },
            },
            {
              '& .Mui-disabled': {
                color: (theme) => {
                  if (themeColor != null) {
                    return `${alpha(theme.palette.getContrastText(themeColors[themeColor][800]), 0.3)} !important`;
                  }
                  return theme.palette.text.disabled;
                },
              },
            },
          ]}
          size="large"
        >
          {shouldPauseNotifications
            ? <NotificationsPausedIcon sx={{ fontSize: 18 }} />
            : <NotificationsIcon sx={{ fontSize: 18 }} />}
        </IconButton>
        <IconButton
          title={muteApp ? 'Unmute' : 'Mute'}
          aria-label={muteApp ? 'Unmute' : 'Mute'}
          onClick={() => requestSetPreference('muteApp', !muteApp)}
          sx={[
            {
              p: 0.725,
              WebkitAppRegion: 'no-drag',
              color: (theme) => {
                if (themeColor != null) {
                  return theme.palette.getContrastText(themeColors[themeColor][800]);
                }
                return theme.palette.text.secondary;
              },
            },
            {
              '& .Mui-disabled': {
                color: (theme) => {
                  if (themeColor != null) {
                    return `${alpha(theme.palette.getContrastText(themeColors[themeColor][800]), 0.3)} !important`;
                  }
                  return theme.palette.text.disabled;
                },
              },
            },
          ]}
          size="large"
        >
          {muteApp
            ? <VolumeOffIcon sx={{ fontSize: 18 }} />
            : <VolumeUpIcon sx={{ fontSize: 18 }} />}
        </IconButton>
        <IconButton
          title="Preferences"
          aria-label="Preferences"
          sx={[
            {
              p: 0.75,
              WebkitAppRegion: 'no-drag',
              color: (theme) => {
                if (themeColor != null) {
                  return theme.palette.getContrastText(themeColors[themeColor][800]);
                }
                return theme.palette.text.secondary;
              },
            },
            {
              '& .Mui-disabled': {
                color: (theme) => {
                  if (themeColor != null) {
                    return `${alpha(theme.palette.getContrastText(themeColors[themeColor][800]), 0.3)} !important`;
                  }
                  return theme.palette.text.disabled;
                },
              },
            },
          ]}
          onClick={() => {
            if (isMenubarBrowser() && activeWorkspaceId) {
              requestShowWorkspacePreferencesWindow(activeWorkspaceId);
            } else {
              requestShowPreferencesWindow();
            }
          }}
          size="large"
        >
          <SettingsIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Box>
  );
};

NavigationBar.defaultProps = {
  themeColor: null,
};

NavigationBar.propTypes = {
  themeColor: PropTypes.string,
};

export default NavigationBar;
