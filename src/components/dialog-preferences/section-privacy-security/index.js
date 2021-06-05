/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';
import isMas from '../../../helpers/is-mas';
import isStandalone from '../../../helpers/is-standalone';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  enqueueRequestRestartSnackbar,
  requestClearBrowsingData,
  requestOpenInBrowser,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogAppLock } from '../../../state/dialog-app-lock/actions';

import DialogAppLock from './dialog-app-lock';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const SectionPrivacySecurity = ({
  blockAds,
  classes,
  ignoreCertificateErrors,
  onOpenDialogAppLock,
  rememberLastPageVisited,
  sentry,
  shareWorkspaceBrowsingData,
  telemetry,
}) => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();
  const canPromptTouchId = window.process.platform === 'darwin'
    && window.remote.systemPreferences.canPromptTouchID();

  return (
    <>
      <Paper elevation={0} className={classes.paper}>
        <List disablePadding dense>
          <ListItem button onClick={requestClearBrowsingData}>
            <ListItemText primary="Clear browsing data" secondary="Clear cookies, cache, and more." />
            <ChevronRightIcon color="action" />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              if (!checkLicense()) {
                return;
              }

              onOpenDialogAppLock();
            }}
          >
            <ListItemText
              primary="App Lock"
              secondary={`Protect this app from unauthorized access with password${canPromptTouchId ? ' or Touch ID' : ''}.`}
            />
            <ChevronRightIcon color="action" />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Block ads &amp; trackers"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={blockAds}
                onChange={(e) => {
                  if (!checkLicense()) {
                    return;
                  }

                  requestSetPreference('blockAds', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText primary="Remember last page visited" />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={rememberLastPageVisited}
                onChange={(e) => {
                  requestSetPreference('rememberLastPageVisited', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          {!appJson.id.startsWith('group-') && appJson.id !== 'clovery' && (
            <>
              <Divider />
              <ListItem>
                <ListItemText primary="Share browsing data & login credentials between services & accounts" />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={shareWorkspaceBrowsingData}
                    onChange={(e) => {
                      requestSetPreference('shareWorkspaceBrowsingData', e.target.checked);
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
              primary="Ignore certificate errors"
              secondary={(
                <>
                  <span>Not recommended. </span>
                  <span
                    role="link"
                    tabIndex={0}
                    className={classes.link}
                    onClick={() => requestOpenInBrowser('https://groups.google.com/a/chromium.org/d/msg/security-dev/mB2KJv_mMzM/ddMteO9RjXEJ')}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      requestOpenInBrowser('https://groups.google.com/a/chromium.org/d/msg/security-dev/mB2KJv_mMzM/ddMteO9RjXEJ');
                    }}
                  >
                    Learn more
                  </span>
                  .
                </>
              )}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={ignoreCertificateErrors}
                onChange={(e) => {
                  requestSetPreference('ignoreCertificateErrors', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          {(isMas() || isStandalone()) && (
            <>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Allow the app to send anonymous crash reports"
                  secondary="Help us quickly diagnose and fix bugs in the app."
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={sentry}
                    onChange={(e) => {
                      requestSetPreference('sentry', e.target.checked);
                      enqueueRequestRestartSnackbar();
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Allow the app to send anonymous usage data"
                  secondary="Help us understand how to improve the product."
                />
                <ListItemSecondaryAction>
                  <Switch
                    edge="end"
                    color="primary"
                    checked={telemetry}
                    onChange={(e) => {
                      requestSetPreference('telemetry', e.target.checked);
                    }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </>
          )}
          <Divider />
          <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.app/privacy?utm_source=${utmSource}`)}>
            <ListItemText primary="Privacy Policy" />
            <ChevronRightIcon color="action" />
          </ListItem>
        </List>
      </Paper>
      <DialogAppLock />
    </>
  );
};

SectionPrivacySecurity.propTypes = {
  blockAds: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  ignoreCertificateErrors: PropTypes.bool.isRequired,
  onOpenDialogAppLock: PropTypes.func.isRequired,
  rememberLastPageVisited: PropTypes.bool.isRequired,
  sentry: PropTypes.bool.isRequired,
  shareWorkspaceBrowsingData: PropTypes.bool.isRequired,
  telemetry: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  blockAds: state.preferences.blockAds,
  ignoreCertificateErrors: state.preferences.ignoreCertificateErrors,
  rememberLastPageVisited: state.preferences.rememberLastPageVisited,
  sentry: state.preferences.sentry,
  shareWorkspaceBrowsingData: state.preferences.shareWorkspaceBrowsingData,
  telemetry: state.preferences.telemetry,
});

const actionCreators = {
  openDialogAppLock,
};

export default connectComponent(
  SectionPrivacySecurity,
  mapStateToProps,
  actionCreators,
  styles,
);
