import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Badge from '@material-ui/core/Badge';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';

const styles = (theme) => ({
  root: {
    height: 68,
    width: 68,
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
    borderLeft: '4px solid',
    borderColor: 'transparent',
  },
  rootHibernate: {
    opacity: 0.4,
  },
  rootActive: {
    borderColor: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    opacity: 1,
  },
  avatar: {
    height: 36,
    width: 36,
    background: theme.palette.common.white,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.common.white),
    lineHeight: '36px',
    textAlign: 'center',
    fontWeight: 500,
    textTransform: 'uppercase',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
  },
  avatarLarge: {
    height: 44,
    width: 44,
    lineHeight: '44px',
  },
  avatarPicture: {
    height: 36,
    width: 36,
  },
  avatarPictureLarge: {
    height: 44,
    width: 44,
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
    fontSize: '12px',
    fontWeight: 500,
    color: theme.palette.text.primary,
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
  sidebarShortcutHints,
  transparentBackground,
}) => (
  <div
    role="button"
    className={classNames(
      classes.root,
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
        className={classNames(
          classes.avatar,
          !sidebarShortcutHints && classes.avatarLarge,
          (id === 'add' || !picturePath) && classes.textAvatar,
          transparentBackground && classes.transparentAvatar,
        )}
      >
        {picturePath ? (
          <img
            alt="Icon"
            className={classNames(
              classes.avatarPicture,
              !sidebarShortcutHints && classes.avatarPictureLarge,
            )}
            src={`file://${picturePath}`}
            draggable={false}
          />
        ) : getAvatarText(id, name, order)}
      </div>
    </Badge>
    {sidebarShortcutHints && (id === 'add' || order < 9) && (
      <p className={classes.shortcutText}>{id === 'add' ? 'Add' : `${window.process.platform === 'darwin' ? '⌘' : 'Ctrl'} + ${order + 1}`}</p>
    )}
  </div>
);

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
  sidebarShortcutHints: PropTypes.bool.isRequired,
  transparentBackground: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
  badgeCount: state.workspaceMetas[ownProps.id] ? state.workspaceMetas[ownProps.id].badgeCount : 0,
  sidebarShortcutHints: state.preferences.sidebarShortcutHints,
});

export default connectComponent(
  WorkspaceSelector,
  mapStateToProps,
  null,
  styles,
);
