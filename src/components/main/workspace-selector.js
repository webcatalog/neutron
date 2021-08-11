/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Color from 'color';

import { makeStyles } from '@material-ui/core/styles';

import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import SvgIcon from '@material-ui/core/SvgIcon';

import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import connectComponent from '../../helpers/connect-component';
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

const useStyles = makeStyles((theme) => ({
  root: {
    height: 56,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontFamily: theme.typography.fontFamily,
    outline: 'none',
    '&:hover': {
      background: theme.palette.action.hover,
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
  rootHibernated: {
    opacity: '0.5',
  },
  rootExpanded: {
    flexDirection: 'row',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  rootWithText: {
    height: 68,
  },
  rootActive: {
    background: (props) => {
      if (props.themeColor != null) {
        return themeColors[props.themeColor][600];
      }
      return theme.palette.action.selected;
    },
    borderLeftColor: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(themeColors[props.themeColor][800]);
      }
      if (theme.palette.type === 'dark') {
        return theme.palette.common.white;
      }
      return theme.palette.common.black;
    },
    '&:hover': {
      background: (props) => {
        if (props.themeColor != null) {
          return themeColors[props.themeColor][600];
        }
        return theme.palette.action.selected;
      },
    },
  },
  avatar: {
    height: 36,
    width: 36,
    background: theme.palette.common.white,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.common.white),
    lineHeight: '36px',
    textAlign: 'center',
    fontWeight: 400,
    textTransform: 'uppercase',
    border: (props) => {
      if (props.themeColor != null || theme.palette.type === 'dark') {
        return 'none';
      }
      return '1px solid rgba(0, 0, 0, 0.12)';
    },
    overflow: 'hidden',
    fontSize: '24px',
  },
  avatarPicture: {
    height: '100%',
    width: '100%',
  },
  textAvatar: {
    background: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(themeColors[props.themeColor][800]);
      }
      return theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black;
    },
    color: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(
          theme.palette.getContrastText(themeColors[props.themeColor][800]),
        );
      }
      return theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white;
    },
  },
  transparentAvatar: {
    background: 'transparent',
    border: 'none',
    color: theme.palette.text.primary,
    borderRadius: 0,
  },
  shortcutText: {
    marginTop: 2,
    marginBottom: 0,
    padding: 0,
    fontSize: '10.5px',
    fontWeight: 500,
    color: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(themeColors[props.themeColor][800]);
      }
      return theme.palette.text.primary;
    },
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
    width: 52,
  },
  badge: {
    lineHeight: '20px',
  },
  expandedText: {
    flex: 1,
    padding: theme.spacing(1),
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    color: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(themeColors[props.themeColor][800]);
      }
      return theme.palette.text.primary;
    },
  },
  sleepAvatar: {
    height: 16,
    width: 16,
    color: theme.palette.text.primary,
  },
  sleepAvatarIcon: {
    height: 12,
    width: 12,
  },
  sleepAvatarWide: {
    width: 32,
  },
}));

const WorkspaceSelector = ({
  accountInfo,
  active,
  backgroundColor,
  badgeCount,
  disableAudio,
  disableNotifications,
  hibernated,
  id,
  name,
  onClick,
  onContextMenu,
  order,
  pictureId,
  preferredIconType,
  searchEngine,
  shouldUseDarkColors,
  sidebarSize,
  sidebarTips,
  themeColor,
  transparentBackground,
}) => {
  const classes = useStyles({ themeColor });
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

    if (sidebarTips !== 'none' && id === 'add') {
      return 'Add';
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
    <div
      role="button"
      className={classnames(
        classes.root,
        isExpanded && classes.rootExpanded,
        tipText && classes.rootWithText,
        active && classes.rootActive,
        hibernated && classes.rootHibernated,
      )}
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
        overlap="circle"
        badgeContent={typeof badgeCount === 'number' && !Number.isNaN(badgeCount) ? badgeCount : 0}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        max={99}
        classes={{ badge: classes.badge }}
      >
        <Badge
          color="default"
          overlap="circle"
          badgeContent={(() => {
            if (hibernated) {
              return (
                <Avatar variant="circle" className={classes.sleepAvatar}>
                  <SvgIcon className={classes.sleepAvatarIcon}>
                    <path fill="currentColor" d="M18.73,18C15.4,21.69 9.71,22 6,18.64C2.33,15.31 2.04,9.62 5.37,5.93C6.9,4.25 9,3.2 11.27,3C7.96,6.7 8.27,12.39 12,15.71C13.63,17.19 15.78,18 18,18C18.25,18 18.5,18 18.73,18Z" />
                  </SvgIcon>
                </Avatar>
              );
            }

            if (disableAudio || disableNotifications) {
              return (
                <>
                  <Avatar variant="circle" className={classnames(classes.sleepAvatar, disableNotifications && disableAudio && classes.sleepAvatarWide)}>
                    {disableNotifications && (
                      <NotificationsOffIcon className={classes.sleepAvatarIcon} />
                    )}
                    {disableAudio && (
                      <VolumeOffIcon className={classes.sleepAvatarIcon} />
                    )}
                  </Avatar>
                </>
              );
            }

            return null;
          })()}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          classes={{ badge: classes.badge }}
        >
          <div
            className={classnames(
              classes.avatar,
              selectedIconType === 'text' && classes.textAvatar,
              selectedIconType === 'image' && transparentBackground && classes.transparentAvatar,
            )}
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
              <img
                alt="Icon"
                className={classnames(
                  classes.avatarPicture,
                )}
                src={(() => {
                  if (pictureId) return `file://${getPicturePath(pictureId)}`;
                  return shouldUseDarkColors
                    ? defaultWorkspaceImageLight : defaultWorkspaceImageDark;
                })()}
                draggable={false}
              />
            )}
            {selectedIconType === 'accountInfo' && (
              <img
                alt="Icon"
                className={classnames(
                  classes.avatarPicture,
                )}
                src={`file://${getPicturePath(accountInfo.pictureId, 'account-pictures')}`}
                draggable={false}
              />
            )}
          </div>
        </Badge>
      </Badge>
      {tipText && (
        <div className={classes.shortcutText}>{tipText}</div>
      )}
      {isExpanded && (
        <div className={classes.expandedText}>
          {hoverText}
        </div>
      )}
    </div>
  );
};

WorkspaceSelector.defaultProps = {
  accountInfo: null,
  active: false,
  backgroundColor: null,
  badgeCount: 0,
  hibernated: false,
  name: null,
  onContextMenu: null,
  order: 0,
  pictureId: null,
  preferredIconType: 'auto',
  transparentBackground: false,
  themeColor: null,
  disableAudio: false,
  disableNotifications: false,
};

WorkspaceSelector.propTypes = {
  accountInfo: PropTypes.object,
  active: PropTypes.bool,
  backgroundColor: PropTypes.string,
  badgeCount: PropTypes.number,
  disableAudio: PropTypes.bool,
  disableNotifications: PropTypes.bool,
  hibernated: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
  order: PropTypes.number,
  pictureId: PropTypes.string,
  preferredIconType: PropTypes.oneOf(['auto', 'text', 'image', 'accountInfo']),
  searchEngine: PropTypes.string.isRequired,
  shouldUseDarkColors: PropTypes.bool.isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  sidebarTips: PropTypes.oneOf(['shortcut', 'name', 'none']).isRequired,
  themeColor: PropTypes.string,
  transparentBackground: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  badgeCount: state.preferences.unreadCountBadge
    && (!ownProps.preferences || ownProps.preferences.unreadCountBadge !== false)
    && state.workspaceMetas[ownProps.id]
    ? state.workspaceMetas[ownProps.id].badgeCount : 0,
  searchEngine: state.preferences.searchEngine,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
  sidebarSize: state.preferences.sidebarSize,
  sidebarTips: state.preferences.sidebarTips,
  backgroundColor: ownProps.preferences
    && ownProps.preferences.color
    && ownProps.preferences.color !== ownProps.themeColor
    ? themeColors[ownProps.preferences.color][600] : null,
});

export default connectComponent(
  WorkspaceSelector,
  mapStateToProps,
  null,
);
