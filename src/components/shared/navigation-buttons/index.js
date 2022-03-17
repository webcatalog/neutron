/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';

import { useSelector } from 'react-redux';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import RefreshIcon from '@material-ui/icons/Refresh';

import themeColors from '../../../constants/theme-colors';

import {
  requestGoBack,
  requestGoForward,
  requestGoHome,
  requestReload,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
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
  // for title bar on older versions of macOS
  // (which has 22px title bar instead 28px like on Big Sur)
  iconButtonDisableGutter: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  iconDisabledWithThemeColor: {
    color: (props) => {
      if (props.themeColor != null) {
        return alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3);
      }
      return theme.palette.text.disabled;
    },
  },
  icon: {
    fontSize: '18px',
  },
  progress: {
    color: (props) => {
      if (props.themeColor != null) {
        return alpha(theme.palette.getContrastText(themeColors[props.themeColor][900]), 0.7);
      }
      return theme.palette.text.secondary;
    },
  },
}));

const NavigationBar = ({ themeColor, disableGutter }) => {
  const classes = useStyles({ themeColor });

  // eslint-disable-next-line max-len
  const activeWorkspace = useSelector((state) => state.workspaces.workspaces[state.workspaces.activeWorkspaceId]);
  const canGoBack = useSelector((state) => state.general.canGoBack);
  const canGoForward = useSelector((state) => state.general.canGoForward);
  const hasWorkspaces = useSelector((state) => Object.keys(state.workspaces.workspaces).length > 0);
  // eslint-disable-next-line max-len
  const isLoading = useSelector((state) => (activeWorkspace && state.workspaceMetas[activeWorkspace.id] ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading) : false));

  return (
    <>
      <IconButton
        title="Back"
        aria-label="Back"
        classes={{
          root: classnames(classes.iconButton, disableGutter && classes.iconButtonDisableGutter),
        }}
        disabled={!hasWorkspaces || !canGoBack}
        onClick={requestGoBack}
      >
        <ArrowBackIcon
          className={classnames(
            classes.icon,
            // has to apply it here
            // somehow, JSS is not applied correctly for IconButton disabled class
            (!hasWorkspaces || !canGoBack) && classes.iconDisabledWithThemeColor,
          )}
        />
      </IconButton>
      <IconButton
        title="Forward"
        aria-label="Forward"
        classes={{
          root: classnames(classes.iconButton, disableGutter && classes.iconButtonDisableGutter),
        }}
        disabled={!hasWorkspaces || !canGoForward}
        onClick={requestGoForward}
      >
        <ArrowForwardIcon
          className={classnames(
            classes.icon,
            // has to apply it here
            // somehow, JSS is not applied correctly for IconButton disabled class
            (!hasWorkspaces || !canGoForward) && classes.iconDisabledWithThemeColor,
          )}
        />
      </IconButton>
      <IconButton
        title="Reload"
        aria-label="Reload"
        classes={{
          root: classnames(classes.iconButton, disableGutter && classes.iconButtonDisableGutter),
        }}
        onClick={requestReload}
        disabled={!hasWorkspaces || isLoading}
      >
        {isLoading ? (
          <CircularProgress size={18} className={classes.progress} />
        ) : (
          <RefreshIcon
            className={classnames(
              classes.icon,
              // has to apply it here
              // somehow, JSS is not applied correctly for IconButton disabled class
              classes.iconDisabledWithThemeColor,
            )}
          />
        )}
      </IconButton>
      <IconButton
        title="Home"
        aria-label="Home"
        classes={{
          root: classnames(classes.iconButton, disableGutter && classes.iconButtonDisableGutter),
        }}
        onClick={requestGoHome}
        disabled={!hasWorkspaces}
      >
        <HomeIcon
          className={classnames(
            classes.icon,
            // has to apply it here
            // somehow, JSS is not applied correctly for IconButton disabled class
            !hasWorkspaces && classes.iconDisabledWithThemeColor,
          )}
        />
      </IconButton>
    </>
  );
};

NavigationBar.defaultProps = {
  themeColor: null,
  disableGutter: false,
};

NavigationBar.propTypes = {
  disableGutter: PropTypes.bool,
  themeColor: PropTypes.string,
};

export default NavigationBar;
