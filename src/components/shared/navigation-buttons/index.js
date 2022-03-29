/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import { alpha } from '@mui/material/styles';

import { useSelector } from 'react-redux';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import RefreshIcon from '@mui/icons-material/Refresh';

import themeColors from '../../../constants/theme-colors';

import {
  requestGoBack,
  requestGoForward,
  requestGoHome,
  requestReload,
} from '../../../senders';

const NavigationBar = ({ disableGutter }) => {
  const activeWorkspace = useSelector(
    (state) => state.workspaces.workspaces[state.workspaces.activeWorkspaceId],
  );
  const canGoBack = useSelector((state) => state.general.canGoBack);
  const canGoForward = useSelector((state) => state.general.canGoForward);
  const hasWorkspaces = useSelector((state) => Object.keys(state.workspaces.workspaces).length > 0);
  const isLoading = useSelector(
    (state) => (activeWorkspace && state.workspaceMetas[activeWorkspace.id]
      ? Boolean(state.workspaceMetas[activeWorkspace.id].isLoading) : false),
  );

  return (
    <>
      <IconButton
        title="Back"
        aria-label="Back"
        sx={[
          {
            p: 0.75,
            WebkitAppRegion: 'no-drag',
            color: (props) => {
              if (props.themeColor != null) {
                return (theme) => theme.palette.getContrastText(themeColors[props.themeColor][800]);
              }
              return (theme) => theme.palette.text.secondary;
            },
          },
          disableGutter && { py: 0 },
        ]}
        disabled={!hasWorkspaces || !canGoBack}
        onClick={requestGoBack}
        size="large"
      >
        <ArrowBackIcon
          sx={[
            { fontSize: 18 },
            // has to apply it here
            // somehow, JSS is not applied correctly for IconButton disabled class
            (!hasWorkspaces || !canGoBack) && {
              color: (props) => {
                if (props.themeColor != null) {
                  // eslint-disable-next-line max-len
                  return (theme) => alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3);
                }
                return (theme) => theme.palette.text.disabled;
              },
            },
          ]}
        />
      </IconButton>
      <IconButton
        title="Forward"
        aria-label="Forward"
        sx={[
          {
            p: 0.75,
            WebkitAppRegion: 'no-drag',
            color: (props) => {
              if (props.themeColor != null) {
                return (theme) => theme.palette.getContrastText(themeColors[props.themeColor][800]);
              }
              return (theme) => theme.palette.text.secondary;
            },
          },
          disableGutter && { py: 0 },
        ]}
        disabled={!hasWorkspaces || !canGoForward}
        onClick={requestGoForward}
        size="large"
      >
        <ArrowForwardIcon
          sx={[
            { fontSize: 18 },
            // has to apply it here
            // somehow, JSS is not applied correctly for IconButton disabled class
            (!hasWorkspaces || !canGoBack) && {
              color: (props) => {
                if (props.themeColor != null) {
                  // eslint-disable-next-line max-len
                  return (theme) => alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3);
                }
                return (theme) => theme.palette.text.disabled;
              },
            },
          ]}
        />
      </IconButton>
      <IconButton
        title="Reload"
        aria-label="Reload"
        sx={[
          {
            p: 0.75,
            WebkitAppRegion: 'no-drag',
            color: (props) => {
              if (props.themeColor != null) {
                return (theme) => theme.palette.getContrastText(themeColors[props.themeColor][800]);
              }
              return (theme) => theme.palette.text.secondary;
            },
          },
          disableGutter && { py: 0 },
        ]}
        onClick={requestReload}
        disabled={!hasWorkspaces || isLoading}
        size="large"
      >
        {isLoading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <RefreshIcon
            sx={{
              fontSize: 18,
              // has to apply it here
              // somehow, JSS is not applied correctly for IconButton disabled class
              color: (props) => {
                if (props.themeColor != null) {
                  // eslint-disable-next-line max-len
                  return (theme) => alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3);
                }
                return (theme) => theme.palette.text.disabled;
              },
            }}
          />
        )}
      </IconButton>
      <IconButton
        title="Home"
        aria-label="Home"
        sx={[
          {
            p: 0.75,
            WebkitAppRegion: 'no-drag',
            color: (props) => {
              if (props.themeColor != null) {
                return (theme) => theme.palette.getContrastText(themeColors[props.themeColor][800]);
              }
              return (theme) => theme.palette.text.secondary;
            },
          },
          disableGutter && { py: 0 },
        ]}
        onClick={requestGoHome}
        disabled={!hasWorkspaces}
        size="large"
      >
        <HomeIcon
          sx={[
            { fontSize: 18 },
            // has to apply it here
            // somehow, JSS is not applied correctly for IconButton disabled class
            !hasWorkspaces && {
              color: (props) => {
                if (props.themeColor != null) {
                  // eslint-disable-next-line max-len
                  return (theme) => alpha(theme.palette.getContrastText(themeColors[props.themeColor][800]), 0.3);
                }
                return (theme) => theme.palette.text.disabled;
              },
            },
          ]}
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
