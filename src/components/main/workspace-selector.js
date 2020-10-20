import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Badge from '@material-ui/core/Badge';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';

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
  rootWithText: {
    height: 68,
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
    fontSize: '10px',
    fontWeight: 500,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: 'calc(100% - 8px)',
    textAlign: 'center',
  },
  badge: {
    lineHeight: '20px',
  },
});

const WorkspaceSelector = ({
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
  sidebarTips,
  transparentBackground,
}) => {
  const tipText = (() => {
    if (sidebarTips !== 'none' && id === 'add') {
      return 'Add';
    }

    if (sidebarTips === 'shortcut') {
      return `${window.process.platform === 'darwin' ? '⌘' : 'Ctrl'} + ${order + 1}`;
    }

    if (sidebarTips === 'name') {
      return name;
    }

    return null;
  })();

  return (
    <div
      role="button"
      className={classnames(
        classes.root,
        tipText && classes.rootWithText,
        hibernated && classes.rootHibernate,
        active && classes.rootActive,
      )}
      onClick={onClick}
      onKeyDown={null}
      onContextMenu={onContextMenu}
      tabIndex="0"
    >
      <Badge color="secondary" badgeContent={badgeCount} max={99} classes={{ badge: classes.badge }}>
        <div
          className={classnames(
            classes.avatar,
            (id === 'add' || !picturePath) && classes.textAvatar,
            transparentBackground && classes.transparentAvatar,
          )}
        >
          {picturePath ? (
            <img
              alt="Icon"
              className={classnames(
                classes.avatarPicture,
              )}
              src={`file://${picturePath}`}
              draggable={false}
            />
          ) : getAvatarText(id, name, order)}
        </div>
      </Badge>
      {tipText && (
        <p className={classes.shortcutText}>{tipText}</p>
      )}
    </div>
  );
};

WorkspaceSelector.defaultProps = {
  active: false,
  badgeCount: 0,
  hibernated: false,
  name: null,
  onContextMenu: null,
  order: 0,
  picturePath: null,
  transparentBackground: false,
};

WorkspaceSelector.propTypes = {
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
  sidebarTips: PropTypes.oneOf(['shortcut', 'name', 'none']).isRequired,
  transparentBackground: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  badgeCount: state.workspaceMetas[ownProps.id] ? state.workspaceMetas[ownProps.id].badgeCount : 0,
  sidebarTips: state.preferences.sidebarTips,
});

export default connectComponent(
  WorkspaceSelector,
  mapStateToProps,
  null,
  styles,
);
