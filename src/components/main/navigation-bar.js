/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';

import SvgIcon from '@material-ui/core/SvgIcon';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';

import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import SettingsIcon from '@material-ui/icons/SettingsSharp';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import connectComponent from '../../helpers/connect-component';
import getUrlFromText from '../../helpers/get-url-from-text';
import getStaticGlobal from '../../helpers/get-static-global';
import isMas from '../../helpers/is-mas';
import isAppx from '../../helpers/is-appx';

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
import BrowserActionList from './browser-action-list';
import NavigationButtons from '../shared/navigation-buttons';
import isMenubarBrowser from '../../helpers/is-menubar-browser';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 36,
    backgroundColor: (props) => {
      if (props.themeColor != null) {
        return themeColors[props.themeColor][800];
      }
      return theme.palette.background.paper;
    },
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    WebkitUserSelect: 'none',
  },
  rootDraggable: {
    WebkitAppRegion: 'drag',
  },
  rootWithTrafficLights: {
    paddingLeft: 68,
  },
  center: {
    flex: 1,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
  },
  iconButton: {
    padding: 6,
    WebkitAppRegion: 'no-drag',
    color: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(themeColors[props.themeColor][800]);
      }
      return theme.palette.text.secondary;
    },
  },
  iconButtonDisabled: {
    color: (props) => {
      if (props.themeColor != null) {
        return `${alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3)} !important`;
      }
      return theme.palette.text.disabled;
    },
  },
  icon: {
    fontSize: '18px',
  },
  addressBarRoot: {
    width: '100%',
    backgroundColor: (props) => {
      if (props.themeColor != null) {
        return themeColors[props.themeColor][900];
      }
      return theme.palette.type === 'dark' ? theme.palette.background.default : theme.palette.grey[200];
    },
    color: (props) => {
      if (props.themeColor != null) {
        return theme.palette.getContrastText(themeColors[props.themeColor][800]);
      }
      return theme.palette.text.primary;
    },
    borderRadius: 4,
    WebkitAppRegion: 'none',
    WebkitUserSelect: 'text',
  },
  addressBarInput: {
    fontSize: '0.8em',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 5,
    paddingBottom: 5,
  },
  goButton: {
    padding: 4,
  },
  leftWithExpandedSidebar: {
    '@media (max-width:600px)': {
      display: 'none',
    },
  },
  centerWithExpandedSidebar: {
    '@media (max-width:700px)': {
      display: 'none',
    },
  },
  browserActionList: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingRight: theme.spacing(1),
    '& * > button': {
      height: 20,
      width: 20,
    },
  },
}));

const NavigationBar = ({
  activeWorkspaceId,
  address,
  addressEdited,
  draggable,
  hasTrafficLights,
  hasWorkspaces,
  muteApp,
  onUpdateAddressBarInfo,
  searchEngine,
  shouldPauseNotifications,
  sidebar,
  sidebarSize,
  themeColor,
}) => {
  const classes = useStyles({ themeColor });
  const [addressInputClicked, setAddressInputClicked] = useState(false);
  const hasExpandedSidebar = sidebar && sidebarSize === 'expanded';
  const addressBarRef = useRef(null);

  useEffect(() => {
    window.ipcRenderer.removeAllListeners('focus-on-address-bar');
    window.ipcRenderer.on('focus-on-address-bar', () => {
      if (addressBarRef.current) {
        addressBarRef.current.focus();
        addressBarRef.current.select();
      }
    });
    return () => {
      window.ipcRenderer.removeAllListeners('focus-on-address-bar');
    };
  }, [addressBarRef]);

  return (
    <div
      className={classnames(
        classes.root,
        draggable && classes.rootDraggable,
        hasTrafficLights && classes.rootWithTrafficLights,
      )}
    >
      <div
        className={classnames(classes.left, hasExpandedSidebar && classes.leftWithExpandedSidebar)}
      >
        <NavigationButtons themeColor={themeColor} />
      </div>
      <div
        className={classnames(
          classes.center,
          hasExpandedSidebar && classes.centerWithExpandedSidebar,
        )}
      >
        <InputBase
          classes={{ root: classes.addressBarRoot, input: classes.addressBarInput }}
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
              className={classes.goButton}
              onClick={() => {
                const processedUrl = getUrlFromText(address, searchEngine);
                onUpdateAddressBarInfo(processedUrl, false);
                requestLoadUrl(processedUrl);
              }}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          )}
          onChange={(e) => {
            onUpdateAddressBarInfo(e.target.value, true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.target.blur();
              const processedUrl = getUrlFromText(address, searchEngine);
              onUpdateAddressBarInfo(processedUrl, false);
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
              onUpdateAddressBarInfo(processedUrl, false);
              requestLoadUrl(processedUrl);
            }
          }}
        />
      </div>
      {!isAppx() && !isMas() && <BrowserActionList className={classes.browserActionList} />}
      <div>
        <RatingButton
          classes={{
            root: classes.iconButton,
            disabled: classes.iconButtonDisabled,
          }}
          iconClassName={classes.icon}
        />
        {window.process.platform === 'darwin' && hasWorkspaces && (
          <IconButton
            title="Share"
            aria-label="Share"
            onClick={() => requestShowShareMenu()}
            classes={{
              root: classes.iconButton,
              disabled: classes.iconButtonDisabled,
            }}
            size="small"
          >
            <SvgIcon className={classes.icon}>
              <path fill="currentColor" d="M12,1L8,5H11V14H13V5H16M18,23H6C4.89,23 4,22.1 4,21V9A2,2 0 0,1 6,7H9V9H6V21H18V9H15V7H18A2,2 0 0,1 20,9V21A2,2 0 0,1 18,23Z" />
            </SvgIcon>
          </IconButton>
        )}
        <IconButton
          title="Notifications"
          aria-label="Notifications"
          onClick={requestShowNotificationsWindow}
          classes={{
            root: classes.iconButton,
            disabled: classes.iconButtonDisabled,
          }}
        >
          {shouldPauseNotifications
            ? <NotificationsPausedIcon className={classes.icon} />
            : <NotificationsIcon className={classes.icon} />}
        </IconButton>
        <IconButton
          title={muteApp ? 'Unmute' : 'Mute'}
          aria-label={muteApp ? 'Unmute' : 'Mute'}
          onClick={() => requestSetPreference('muteApp', !muteApp)}
          classes={{
            root: classes.iconButton,
            disabled: classes.iconButtonDisabled,
          }}
        >
          {muteApp
            ? <VolumeOffIcon className={classes.icon} />
            : <VolumeUpIcon className={classes.icon} />}
        </IconButton>
        <IconButton
          title="Preferences"
          aria-label="Preferences"
          classes={{
            root: classes.iconButton,
            disabled: classes.iconButtonDisabled,
          }}
          onClick={() => {
            if (isMenubarBrowser() && activeWorkspaceId) {
              requestShowWorkspacePreferencesWindow(activeWorkspaceId);
            } else {
              requestShowPreferencesWindow();
            }
          }}
        >
          <SettingsIcon className={classes.icon} />
        </IconButton>
      </div>
    </div>
  );
};

NavigationBar.defaultProps = {
  activeWorkspaceId: null,
  address: '',
  themeColor: null,
};

NavigationBar.propTypes = {
  activeWorkspaceId: PropTypes.string,
  address: PropTypes.string,
  addressEdited: PropTypes.bool.isRequired,
  draggable: PropTypes.bool.isRequired,
  hasTrafficLights: PropTypes.bool.isRequired,
  hasWorkspaces: PropTypes.bool.isRequired,
  muteApp: PropTypes.bool.isRequired,
  onUpdateAddressBarInfo: PropTypes.func.isRequired,
  searchEngine: PropTypes.string.isRequired,
  shouldPauseNotifications: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  themeColor: PropTypes.string,
};

const mapStateToProps = (state) => ({
  activeWorkspaceId: state.workspaces.activeWorkspaceId,
  address: state.general.address || '',
  addressEdited: Boolean(state.general.addressEdited),
  draggable: window.process.platform === 'darwin' && !state.preferences.titleBar,
  hasTrafficLights: window.process.platform === 'darwin'
    && getStaticGlobal('windowButtons')
    && window.mode !== 'menubar'
    && !state.preferences.titleBar
    && !state.preferences.sidebar
    && !state.general.isFullScreen,
  hasWorkspaces: Object.keys(state.workspaces.workspaces).length > 0,
  muteApp: state.preferences.muteApp,
  searchEngine: state.preferences.searchEngine,
  shouldPauseNotifications: state.notifications.pauseNotificationsInfo !== null,
  sidebar: state.preferences.sidebar,
  sidebarSize: state.preferences.sidebarSize,
});

const actionCreators = {
  updateAddressBarInfo,
};

export default connectComponent(
  NavigationBar,
  mapStateToProps,
  actionCreators,
);
