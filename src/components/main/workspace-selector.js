/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Badge from '@material-ui/core/Badge';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';
import getUrlFromText from '../../helpers/get-url-from-text';

import {
  requestOpenUrlInWorkspace,
} from '../../senders';

const styles = (theme) => ({
  root: {
    height: 48,
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
    opacity: 0.8,
    position: 'relative',
    // to show active status
    borderLeft: '3px solid',
    borderLeftColor: 'transparent',
    // same as left minus 1px of sidebar border to align the children to the center
    borderRight: '2px solid',
    borderRightColor: 'transparent',
  },
  rootExpanded: {
    flexDirection: 'row',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  rootWithText: {
    height: 60,
  },
  rootHibernate: {
    opacity: 0.4,
  },
  rootActive: {
    background: theme.palette.action.selected,
    borderLeftColor: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    opacity: 1,
    '&:hover': {
      background: theme.palette.action.selected,
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
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    fontSize: '24px',
  },
  avatarPicture: {
    height: 36,
    width: 36,
  },
  textAvatar: {
    background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    color: theme.palette.getContrastText(theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
  },
  transparentAvatar: {
    background: 'transparent',
    border: 'none',
    color: theme.palette.text.primary,
  },
  shortcutText: {
    marginTop: 2,
    marginBottom: 0,
    padding: 0,
    fontSize: '10.5px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    textAlign: 'center',
  },
  badge: {
    lineHeight: '20px',
  },
  expandedText: {
    flex: 1,
    padding: theme.spacing(1),
  },
  smallExpandedText: {
    fontSize: '0.75rem',
  },
});

const WorkspaceSelector = ({
  accountInfo,
  active,
  badgeCount,
  classes,
  hibernated,
  id,
  name,
  onClick,
  onContextMenu,
  order,
  picturePath,
  preferredIconType,
  searchEngine,
  sidebarTips,
  sidebarSize,
  transparentBackground,
}) => {
  const isExpanded = sidebarSize === 'expanded';
  const shortcutTip = order < 9 && id !== 'add'
    ? `${window.process.platform === 'darwin' ? '⌘' : 'Ctrl+'}${order + 1}` : null;

  const fullName = (() => {
    if (accountInfo) {
      if (accountInfo.name && accountInfo.email) {
        return `${accountInfo.name} (${accountInfo.email})`;
      }
      if (accountInfo.name) {
        return accountInfo.name;
      }
    }
    return name;
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
      return 'Add Workspace';
    }

    if (fullName) {
      return `${fullName}${shortcutTip ? ` (${shortcutTip})` : ''}`;
    }

    if (typeof order === 'number') {
      return `Workspace ${order + 1}${shortcutTip ? ` (${shortcutTip})` : ''}`;
    }

    return null;
  })();

  let selectedIconType = 'text';
  if (picturePath && (preferredIconType === 'auto' || preferredIconType === 'image')) {
    selectedIconType = 'image';
  } else if (accountInfo && accountInfo.picturePath && (preferredIconType === 'auto' || preferredIconType === 'accountInfo')) {
    selectedIconType = 'accountInfo';
  }

  return (
    <div
      role="button"
      className={classnames(
        classes.root,
        isExpanded && classes.rootExpanded,
        tipText && classes.rootWithText,
        hibernated && classes.rootHibernate,
        active && classes.rootActive,
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
      <div>
        <Badge color="secondary" badgeContent={badgeCount} max={99} classes={{ badge: classes.badge }}>
          <div
            className={classnames(
              classes.avatar,
              selectedIconType === 'text' && classes.textAvatar,
              transparentBackground && classes.transparentAvatar,
            )}
          >
            {selectedIconType === 'text' && getAvatarText(id, fullName, order)}
            {selectedIconType === 'image' && (
              <img
                alt="Icon"
                className={classnames(
                  classes.avatarPicture,
                )}
                src={`file://${picturePath}`}
                draggable={false}
              />
            )}
            {selectedIconType === 'accountInfo' && (
              <img
                alt="Icon"
                className={classnames(
                  classes.avatarPicture,
                )}
                src={`file://${accountInfo.picturePath}`}
                draggable={false}
              />
            )}
          </div>
        </Badge>
        {tipText && (
          <p className={classes.shortcutText}>{tipText}</p>
        )}
      </div>
      {isExpanded && (
        <div className={classes.expandedText}>
          {fullName || hoverText}
          <span className={classes.smallExpandedText}>
            {shortcutTip ? ` (${shortcutTip})` : ''}
          </span>
        </div>
      )}
    </div>
  );
};

WorkspaceSelector.defaultProps = {
  accountInfo: null,
  active: false,
  badgeCount: 0,
  hibernated: false,
  name: null,
  onContextMenu: null,
  order: 0,
  picturePath: null,
  preferredIconType: 'auto',
  transparentBackground: false,
};

WorkspaceSelector.propTypes = {
  accountInfo: PropTypes.object,
  active: PropTypes.bool,
  badgeCount: PropTypes.number,
  classes: PropTypes.object.isRequired,
  hibernated: PropTypes.bool,
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onContextMenu: PropTypes.func,
  order: PropTypes.number,
  picturePath: PropTypes.string,
  preferredIconType: PropTypes.oneOf(['auto', 'text', 'image', 'accountInfo']),
  searchEngine: PropTypes.string.isRequired,
  sidebarTips: PropTypes.oneOf(['shortcut', 'name', 'none']).isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  transparentBackground: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  badgeCount: state.workspaceMetas[ownProps.id] ? state.workspaceMetas[ownProps.id].badgeCount : 0,
  sidebarTips: state.preferences.sidebarTips,
  sidebarSize: state.preferences.sidebarSize,
  searchEngine: state.preferences.searchEngine,
});

export default connectComponent(
  WorkspaceSelector,
  mapStateToProps,
  null,
  styles,
);
