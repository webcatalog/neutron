/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import HomeIcon from '@material-ui/icons/Home';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import RefreshIcon from '@material-ui/icons/Refresh';

import connectComponent from '../../../helpers/connect-component';
import themeColors from '../../../constants/theme-colors';

import { updateAddressBarInfo } from '../../../state/general/actions';

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
  iconDisabledWithThemeColor: {
    color: (props) => {
      if (props.themeColor != null) {
        return fade(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3);
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
        return fade(theme.palette.getContrastText(themeColors[props.themeColor][900]), 0.7);
      }
      return theme.palette.text.secondary;
    },
  },
}));

const NavigationBar = ({
  canGoBack,
  canGoForward,
  hasWorkspaces,
  isLoading,
  themeColor,
}) => {
  const classes = useStyles({ themeColor });

  return (
    <>
      <IconButton
        title="Back"
        aria-label="Back"
        classes={{
          root: classes.iconButton,
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
          root: classes.iconButton,
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
          root: classes.iconButton,
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
          root: classes.iconButton,
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
  isLoading: false,
  themeColor: null,
};

NavigationBar.propTypes = {
  canGoBack: PropTypes.bool.isRequired,
  canGoForward: PropTypes.bool.isRequired,
  hasWorkspaces: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
  themeColor: PropTypes.string,
};

const mapStateToProps = (state) => {
  const activeWorkspace = state.workspaces.workspaces[state.workspaces.activeWorkspaceId];

  return {
    canGoBack: state.general.canGoBack,
    canGoForward: state.general.canGoForward,
    hasWorkspaces: Object.keys(state.workspaces.workspaces).length > 0,
    isLoading: activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading)
      : false,
  };
};

const actionCreators = {
  updateAddressBarInfo,
};

export default connectComponent(
  NavigationBar,
  mapStateToProps,
  actionCreators,
);
