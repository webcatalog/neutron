/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotificationsPausedIcon from '@material-ui/icons/NotificationsPaused';
import RefreshIcon from '@material-ui/icons/Refresh';
import SettingsIcon from '@material-ui/icons/SettingsSharp';

import connectComponent from '../../helpers/connect-component';
import getUrlFromText from '../../helpers/get-url-from-text';

import searchEngines from '../../constants/search-engines';

import { updateAddressBarInfo } from '../../state/general/actions';

import {
  requestGoBack,
  requestGoForward,
  requestGoHome,
  requestLoadUrl,
  requestReload,
  requestShowNotificationsWindow,
  requestShowPreferencesWindow,
} from '../../senders';

const styles = (theme) => ({
  root: {
    width: '100%',
    height: 36,
    backgroundColor: theme.palette.background.paper,
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
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
    paddingLeft: 68 + theme.spacing(1),
  },
  center: {
    flex: 1,
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    WebkitAppRegion: 'no-drag',
  },
  iconButton: {
    padding: 6,
    WebkitAppRegion: 'no-drag',
  },
  icon: {
    fontSize: '18px',
  },
  addressBarRoot: {
    width: '100%',
    background: theme.palette.background.default,
    borderRadius: 16,
    WebkitAppRegion: 'none',
    WebkitUserSelect: 'text',
  },
  addressBarInput: {
    fontSize: '0.8em',
    paddingLeft: 12,
    paddingRight: 12,
    paddingTop: 4,
    paddingBottom: 4,
  },
  goButton: {
    padding: 4,
  },
});

const NavigationBar = ({
  address,
  addressEdited,
  canGoBack,
  canGoForward,
  classes,
  hasTrafficLights,
  hasWorkspaces,
  onUpdateAddressBarInfo,
  searchEngine,
  shouldPauseNotifications,
  draggable,
}) => {
  const [addressInputClicked, setAddressInputClicked] = useState(false);

  return (
    <div
      className={classnames(
        classes.root,
        draggable && classes.rootDraggable,
        hasTrafficLights && classes.rootWithTrafficLights,
      )}
    >
      <div className={classes.left}>
        <IconButton aria-label="Go back" className={classes.iconButton} disabled={!hasWorkspaces || !canGoBack} onClick={requestGoBack}>
          <ArrowBackIcon className={classes.icon} />
        </IconButton>
        <IconButton aria-label="Go forward" className={classes.iconButton} disabled={!hasWorkspaces || !canGoForward} onClick={requestGoForward}>
          <ArrowForwardIcon className={classes.icon} />
        </IconButton>
        <IconButton aria-label="Reload" className={classes.iconButton} onClick={requestReload} disabled={!hasWorkspaces}>
          <RefreshIcon className={classes.icon} />
        </IconButton>
        <IconButton aria-label="Go home" className={classes.iconButton} onClick={requestGoHome} disabled={!hasWorkspaces}>
          <HomeIcon className={classes.icon} />
        </IconButton>
      </div>
      <div className={classes.center}>
        <InputBase
          classes={{ root: classes.addressBarRoot, input: classes.addressBarInput }}
          placeholder={`Search on ${searchEngines[searchEngine].name} or type a URL`}
          type="text"
          value={hasWorkspaces ? address : ''}
          disabled={!hasWorkspaces}
          endAdornment={addressEdited && address && hasWorkspaces && (
            <IconButton
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
      <div>
        <IconButton aria-label="Notifications" onClick={requestShowNotificationsWindow} className={classes.iconButton}>
          {shouldPauseNotifications
            ? <NotificationsPausedIcon className={classes.icon} />
            : <NotificationsIcon className={classes.icon} />}
        </IconButton>
        <IconButton aria-label="Preferences" className={classes.iconButton} onClick={() => requestShowPreferencesWindow()}>
          <SettingsIcon className={classes.icon} />
        </IconButton>
      </div>
    </div>
  );
};

NavigationBar.defaultProps = {
  address: '',
};

NavigationBar.propTypes = {
  address: PropTypes.string,
  addressEdited: PropTypes.bool.isRequired,
  canGoBack: PropTypes.bool.isRequired,
  canGoForward: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  draggable: PropTypes.bool.isRequired,
  hasTrafficLights: PropTypes.bool.isRequired,
  hasWorkspaces: PropTypes.bool.isRequired,
  onUpdateAddressBarInfo: PropTypes.func.isRequired,
  searchEngine: PropTypes.string.isRequired,
  shouldPauseNotifications: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  address: state.general.address || '',
  addressEdited: Boolean(state.general.addressEdited),
  canGoBack: state.general.canGoBack,
  canGoForward: state.general.canGoForward,
  draggable: window.process.platform === 'darwin' && !state.preferences.titleBar,
  hasTrafficLights: window.process.platform === 'darwin' && !state.preferences.titleBar && !state.preferences.sidebar,
  hasWorkspaces: Object.keys(state.workspaces).length > 0,
  searchEngine: state.preferences.searchEngine,
  shouldPauseNotifications: state.notifications.pauseNotificationsInfo !== null,
});

const actionCreators = {
  updateAddressBarInfo,
};

export default connectComponent(
  NavigationBar,
  mapStateToProps,
  actionCreators,
  styles,
);
