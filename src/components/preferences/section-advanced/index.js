/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import roundTime from '../../../helpers/round-time';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  enqueueRequestRestartSnackbar,
  requestOpenInBrowser,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogInternalUrls } from '../../../state/dialog-internal-urls/actions';
import { open as openDialogProxy } from '../../../state/dialog-proxy/actions';
import { open as openDialogRefreshInterval } from '../../../state/dialog-refresh-interval/actions';

import autoRefreshIntervals from '../../../constants/auto-refresh-intervals';

import DialogInternalUrls from '../../shared/dialog-internal-urls';
import DialogRefreshInterval from '../../shared/dialog-refresh-interval';

const styles = (theme) => ({
  link: {
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus': {
      textDecoration: 'underline',
    },
  },
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
  refreshEvery: {
    float: 'right',
    paddingRight: theme.spacing(1),
  },
});

const SectionAdvanced = ({
  alwaysOnTop,
  autoRefresh,
  autoRefreshInterval,
  autoRefreshOnlyWhenInactive,
  classes,
  hibernateUnusedWorkspacesAtLaunch,
  internalUrlRule,
  onOpenDialogInternalUrls,
  onOpenDialogRefreshInterval,
  swipeToNavigate,
  useHardwareAcceleration,
  useSystemTitleBar,
}) => (
  <>
    <List disablePadding dense>
      <ListItem button onClick={onOpenDialogInternalUrls}>
        <ListItemText
          primary="Internal URLs"
          secondary={internalUrlRule ? `/^${internalUrlRule}$/i` : 'Not set'}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary={`Hibernate unused ${getWorkspaceFriendlyName(true).toLowerCase()} at app launch`}
          secondary={`Hibernate all ${getWorkspaceFriendlyName(true).toLowerCase()} at launch, except the last active ${getWorkspaceFriendlyName().toLowerCase()}.`}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={hibernateUnusedWorkspacesAtLaunch}
            onChange={(e) => {
              requestSetPreference('hibernateUnusedWorkspacesAtLaunch', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {window.process.platform === 'darwin' && (
        <>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Swipe with three fingers to navigate"
              secondary={(
                <>
                  <span>Navigate between pages with 3-finger gestures. </span>
                  <span>Swipe left to go back or swipe right to go forward.</span>
                  <br />
                  <span>To enable it, you also need to change </span>
                  <b>
                    macOS Preferences &gt; Trackpad &gt; More Gestures &gt; Swipe between page
                  </b>
                  <span> to </span>
                  <b>Swipe with three fingers</b>
                  <span> or </span>
                  <b>Swipe with two or three fingers.</b>
                </>
              )}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={swipeToNavigate}
                onChange={(e) => {
                  requestSetPreference('swipeToNavigate', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </>
      )}
      {window.process.platform !== 'darwin' && (
        <>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Use system title bar and borders"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={useSystemTitleBar}
                onChange={(e) => {
                  requestSetPreference('useSystemTitleBar', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </>
      )}
      <Divider />
      <ListItem>
        <ListItemText
          primary="Keep window always on top"
          secondary="The window won't be hidden even when you click outside."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={alwaysOnTop}
            onChange={(e) => {
              requestSetPreference('alwaysOnTop', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary="Reload web pages automatically"
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={autoRefresh}
            onChange={(e) => {
              requestSetPreference('autoRefresh', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText primary="Reload every" classes={{ primary: classes.refreshEvery }} />
        <Select
          value={autoRefreshInterval}
          onChange={(e) => {
            if (e.target.value === 'custom') {
              onOpenDialogRefreshInterval();
              return;
            }
            requestSetPreference('autoRefreshInterval', e.target.value);
            enqueueRequestRestartSnackbar();
          }}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
          disabled={!autoRefresh}
        >
          {autoRefreshIntervals.map((opt) => (
            <MenuItem key={opt.value} dense value={opt.value}>{opt.name}</MenuItem>
          ))}
          {(() => {
            const isCustom = autoRefreshIntervals
              .find((interval) => interval.value === autoRefreshInterval) == null;
            if (isCustom) {
              const time = roundTime(autoRefreshInterval);
              return (
                <MenuItem dense value={autoRefreshInterval}>
                  {`${time.value} ${time.unit}`}
                </MenuItem>
              );
            }
            return null;
          })()}
          <MenuItem dense value="custom">Custom</MenuItem>
        </Select>
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Only reload on inactivity"
          secondary={(
            <>
              <span>Keep certain apps from logging </span>
              <span>out automatically when you are away. </span>
              <span
                role="link"
                tabIndex={0}
                className={classes.link}
                onClick={() => requestOpenInBrowser(`https://help.webcatalog.app/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${getUtmSource()}`)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  requestOpenInBrowser(`https://help.webcatalog.app/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${getUtmSource()}`);
                }}
              >
                Learn more
              </span>
              <span>.</span>
            </>
          )}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={autoRefreshOnlyWhenInactive}
            disabled={!autoRefresh}
            onChange={(e) => {
              requestSetPreference('autoRefreshOnlyWhenInactive', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary="Use hardware acceleration when available"
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={useHardwareAcceleration}
            onChange={(e) => {
              requestSetPreference('useHardwareAcceleration', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
    <DialogInternalUrls />
    <DialogRefreshInterval />
  </>
);

SectionAdvanced.defaultProps = {
  internalUrlRule: null,
};

SectionAdvanced.propTypes = {
  alwaysOnTop: PropTypes.bool.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  autoRefreshInterval: PropTypes.number.isRequired,
  autoRefreshOnlyWhenInactive: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  hibernateUnusedWorkspacesAtLaunch: PropTypes.bool.isRequired,
  internalUrlRule: PropTypes.string,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  onOpenDialogRefreshInterval: PropTypes.func.isRequired,
  swipeToNavigate: PropTypes.bool.isRequired,
  useHardwareAcceleration: PropTypes.bool.isRequired,
  useSystemTitleBar: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  alwaysOnTop: state.preferences.alwaysOnTop,
  autoRefresh: state.preferences.autoRefresh,
  autoRefreshInterval: state.preferences.autoRefreshInterval,
  autoRefreshOnlyWhenInactive: state.preferences.autoRefreshOnlyWhenInactive,
  defaultFontSize: state.preferences.defaultFontSize,
  hibernateUnusedWorkspacesAtLaunch: state.preferences.hibernateUnusedWorkspacesAtLaunch,
  internalUrlRule: state.preferences.internalUrlRule,
  swipeToNavigate: state.preferences.swipeToNavigate,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
  useSystemTitleBar: state.preferences.useSystemTitleBar,
});

const actionCreators = {
  openDialogInternalUrls,
  openDialogProxy,
  openDialogRefreshInterval,
};

export default connectComponent(
  SectionAdvanced,
  mapStateToProps,
  actionCreators,
  styles,
);
