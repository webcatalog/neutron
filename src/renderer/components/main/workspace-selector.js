/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import Color from 'color';

import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import SvgIcon from '@mui/material/SvgIcon';

import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';

import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import getAvatarText from '../../helpers/get-avatar-text';
import getUrlFromText from '../../helpers/get-url-from-text';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';
import getPicturePath from '../../helpers/get-picture-path';
import themeColors from '../../constants/theme-colors';

import {
  requestOpenUrlInWorkspace,
} from '../../senders';

import defaultWorkspaceImageLight from '../../images/default-workspace-image-light.png';
import defaultWorkspaceImageDark from '../../images/default-workspace-image-dark.png';

const WorkspaceSelector = ({
  accountInfo,
  active,
  disableAudio,
  disableNotifications,
  hibernated,
  id,
  name,
  onClick,
  onContextMenu,
  order,
  pictureId,
  preferences,
  preferredIconType,
  themeColor,
  transparentBackground,
}) => {
  const badgeCount = useSelector((state) => (state.preferences.unreadCountBadge
  && (!preferences || preferences.unreadCountBadge !== false)
  && state.workspaceMetas[id] ? state.workspaceMetas[id].badgeCount : 0));
  const searchEngine = useSelector((state) => state.preferences.searchEngine);
  const shouldUseDarkColors = useSelector((state) => state.general.shouldUseDarkColors);
  const sidebarSize = useSelector((state) => state.preferences.sidebarSize);
  const sidebarTips = useSelector((state) => state.preferences.sidebarTips);

  const backgroundColor = preferences
  && preferences.color
  && preferences.color
  !== themeColor ? themeColors[preferences.color][600] : null;

  const isExpanded = sidebarSize === 'expanded';
  const shortcutTip = order < 9 && id !== 'add'
    ? `${window.process.platform === 'darwin' ? '⌘' : 'Ctrl+'}${order + 1}` : null;

  const userDefinedName = (() => {
    if (name) return name;
    if (accountInfo) {
      if (accountInfo.name && accountInfo.email) {
        return `${accountInfo.name} (${accountInfo.email})`;
      }
      if (accountInfo.name) {
        return accountInfo.name;
      }
    }
    return null;
  })();

  const fullName = (() => {
    if (userDefinedName) return userDefinedName;
    return `${getWorkspaceFriendlyName()} ${order + 1}`;
  })();

  const tipText = (() => {
    if (isExpanded) {
      return null;
    }

    if (sidebarTips === 'shortcut') {
      return shortcutTip;
    }

    if (sidebarTips === 'name') {
      return fullName;
    }

    return null;
  })();

  const hoverText = (() => {
    if (id === 'add') {
      return `Add ${getWorkspaceFriendlyName()}`;
    }

    if (fullName) {
      return `${fullName}${shortcutTip ? ` (${shortcutTip})` : ''}`;
    }

    if (typeof order === 'number') {
      return `${getWorkspaceFriendlyName()} ${order + 1}${shortcutTip ? ` (${shortcutTip})` : ''}`;
    }

    return null;
  })();

  let selectedIconType = 'text';
  if ((pictureId && preferredIconType === 'auto') || preferredIconType === 'image') {
    selectedIconType = 'image';
  } else if (accountInfo && accountInfo.pictureId && (preferredIconType === 'auto' || preferredIconType === 'accountInfo')) {
    selectedIconType = 'accountInfo';
  }

  return (
    <Box
      role="button"
      sx={[
        {
          height: 56,
          width: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: (theme) => theme.typography.fontFamily,
          outline: 'none',
          '&:hover': {
            background: (theme) => theme.palette.action.hover,
            cursor: 'pointer',
          },
          WebkitAppRegion: 'no-drag',
          position: 'relative',
          // to show active status
          borderLeft: '3px solid',
          borderLeftColor: 'transparent',
          // same as left minus 1px of sidebar border to align the children to the center
          borderRight: '2px solid',
          borderRightColor: 'transparent',
        },
        isExpanded && {
          flexDirection: 'row',
          px: 1,
        },
        tipText && {
          height: 68,
        },
        active && {
          background: (theme) => {
            if (themeColor != null) {
              return themeColors[themeColor][600];
            }
            return theme.palette.action.selected;
          },
          borderLeftColor: (theme) => {
            if (themeColor != null) {
              return theme.palette.getContrastText(themeColors[themeColor][800]);
            }
            if (theme.palette.mode === 'dark') {
              return theme.palette.common.white;
            }
            return theme.palette.common.black;
          },
          '&:hover': {
            background: (theme) => {
              if (themeColor != null) {
                return themeColors[themeColor][600];
              }
              return theme.palette.action.selected;
            },
          },
        },
        hibernated && { opacity: '0.5' },
      ]}
      onClick={onClick}
      onKeyDown={null}
      onContextMenu={onContextMenu}
      tabIndex="0"
      onDragOver={(e) => {
        // In order to have the drop event occur on a div element,
        // you must cancel ondragover event
        // https://stackoverflow.com/questions/21339924/drop-event-not-firing-in-chrome
        e.preventDefault();
      }}
      onDrop={(e) => {
        const text = e.dataTransfer.getData('URL') || e.dataTransfer.getData('text');
        if (text) {
          e.preventDefault();
          const processedUrl = getUrlFromText(text, searchEngine);
          if (id === 'add') {
            requestOpenUrlInWorkspace(processedUrl); // create new workspace & open the URL
          } else {
            requestOpenUrlInWorkspace(processedUrl, id);
          }
        }
      }}
      title={hoverText}
    >
      <Badge
        color="error"
        overlap="circular"
        badgeContent={typeof badgeCount === 'number' && !Number.isNaN(badgeCount) ? badgeCount : 0}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        max={99}
        sx={{
          '& .MuiBadge-badge': {
            lineHeight: '20px',
          },
        }}
      >
        <Badge
          color="default"
          overlap="circular"
          badgeContent={(() => {
            if (hibernated) {
              return (
                <Avatar
                  variant="circular"
                  sx={{
                    height: 16,
                    width: 16,
                    color: 'text.primary',
                  }}
                >
                  <SvgIcon
                    sx={{
                      height: 12,
                      width: 12,
                    }}
                  >
                    <path fill="currentColor" d="M18.73,18C15.4,21.69 9.71,22 6,18.64C2.33,15.31 2.04,9.62 5.37,5.93C6.9,4.25 9,3.2 11.27,3C7.96,6.7 8.27,12.39 12,15.71C13.63,17.19 15.78,18 18,18C18.25,18 18.5,18 18.73,18Z" />
                  </SvgIcon>
                </Avatar>
              );
            }

            if (disableAudio || disableNotifications) {
              return (
                <Avatar
                  variant="circular"
                  sx={[
                    {
                      height: 16,
                      width: 16,
                      color: 'text.primary',
                    },
                    disableNotifications && disableAudio && { width: 32 },
                  ]}
                >
                  {disableNotifications && (
                  <NotificationsOffIcon
                    sx={{
                      height: 12,
                      width: 12,
                    }}
                  />
                  )}
                  {disableAudio && (
                  <VolumeOffIcon
                    sx={{
                      height: 12,
                      width: 12,
                    }}
                  />
                  )}
                </Avatar>
              );
            }

            return null;
          })()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          sx={{
            '& ..MuiBadge-badge': {
              lineHeight: '20px',
            },
          }}
        >
          <Box
            sx={[
              {
                height: 36,
                width: 36,
                background: (theme) => theme.palette.common.white,
                borderRadius: 0.5,
                color: (theme) => theme.palette.getContrastText(theme.palette.common.white),
                lineHeight: '36px',
                textAlign: 'center',
                fontWeight: 400,
                textTransform: 'uppercase',
                border: (theme) => {
                  if (themeColor != null || theme.palette.mode === 'dark') {
                    return 'none';
                  }
                  return '1px solid rgba(0, 0, 0, 0.12)';
                },
                overflow: 'hidden',
                fontSize: '24px',
              },
              selectedIconType === 'text' && {
                background: (theme) => {
                  if (themeColor != null) {
                    return theme.palette.getContrastText(themeColors[themeColor][800]);
                  }
                  return theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black;
                },
                color: (theme) => {
                  if (themeColor != null) {
                    return theme.palette.getContrastText(
                      theme.palette.getContrastText(themeColors[themeColor][800]),
                    );
                  }
                  return theme.palette.mode === 'dark' ? theme.palette.common.black : theme.palette.common.white;
                },
              },
              selectedIconType === 'image' && transparentBackground && {
                background: 'transparent',
                border: 'none',
                color: 'text.primary',
                borderRadius: 0,
              },
            ]}
            style={(() => {
              if (selectedIconType === 'text' && backgroundColor) {
                return {
                  backgroundColor,
                  color: Color(backgroundColor).isDark() ? '#fff' : '#000',
                };
              }
              return null;
            })()}
          >
            {selectedIconType === 'text' && getAvatarText(id, userDefinedName, order)}
            {selectedIconType === 'image' && (
              <Box
                component="img"
                alt="Icon"
                sx={{
                  height: 1,
                  width: 1,
                }}
                src={(() => {
                  if (pictureId) return `file://${getPicturePath(pictureId)}`;
                  return shouldUseDarkColors
                    ? defaultWorkspaceImageLight : defaultWorkspaceImageDark;
                })()}
                draggable={false}
              />
            )}
            {selectedIconType === 'accountInfo' && (
              <Box
                component="img"
                alt="Icon"
                sx={{
                  height: 1,
                  width: 1,
                }}
                src={`file://${getPicturePath(accountInfo.pictureId, 'account-pictures')}`}
                draggable={false}
              />
            )}
          </Box>
        </Badge>
      </Badge>
      {tipText && (
        <Box
          sx={{
            mt: 0.25,
            mb: 0,
            p: 0,
            fontSize: '10.5px',
            fontWeight: 500,
            color: (theme) => {
              if (themeColor != null) {
                return theme.palette.getContrastText(themeColors[themeColor][800]);
              }
              return theme.palette.text.primary;
            },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center',
            width: 52,
          }}
        >
          {tipText}
        </Box>
      )}
      {isExpanded && (
        <Box
          sx={{
            flex: 1,
            p: 1,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: (theme) => {
              if (themeColor != null) {
                return theme.palette.getContrastText(themeColors[themeColor][800]);
              }
              return theme.palette.text.primary;
            },
          }}
        >
          {hoverText}
        </Box>
      )}
    </Box>
  );
};

WorkspaceSelector.defaultProps = {
  accountInfo: null,
  active: false,
  disableAudio: false,
  disableNotifications: false,
  hibernated: false,
  name: null,
  onContextMenu: null,
  order: 0,
  pictureId: null,
  preferences: null,
  preferredIconType: 'auto',
  themeColor: null,
  transparentBackground: false,
};

WorkspaceSelector.propTypes = {
  accountInfo: PropTypes.object,
  active: PropTypes.bool,
  disableAudio: PropTypes.bool,
  disableNotifications: PropTypes.bool,
  hibernated: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
  order: PropTypes.number,
  pictureId: PropTypes.string,
  preferences: PropTypes.object,
  preferredIconType: PropTypes.oneOf(['auto', 'text', 'image', 'accountInfo']),
  themeColor: PropTypes.string,
  transparentBackground: PropTypes.bool,
};

export default WorkspaceSelector;
