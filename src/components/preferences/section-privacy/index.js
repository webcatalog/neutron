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
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';
import getStaticGlobal from '../../../helpers/get-static-global';

import {
  enqueueRequestRestartSnackbar,
  requestClearBrowsingData,
  requestOpenInBrowser,
  requestSetPreference,
} from '../../../senders';

const styles = () => ({
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
});

const SectionBrowsing = ({
  blockAds,
  classes,
  ignoreCertificateErrors,
  rememberLastPageVisited,
  shareWorkspaceBrowsingData,
}) => {
  const appJson = getStaticGlobal('appJson');

  return (
    <>
      <List disablePadding dense>
        <ListItem button onClick={requestClearBrowsingData}>
          <ListItemText primary="Clear browsing data" secondary="Clear cookies, cache, and more." />
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
      </List>
    </>
  );
};

SectionBrowsing.propTypes = {
  blockAds: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  ignoreCertificateErrors: PropTypes.bool.isRequired,
  rememberLastPageVisited: PropTypes.bool.isRequired,
  shareWorkspaceBrowsingData: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  blockAds: state.preferences.blockAds,
  ignoreCertificateErrors: state.preferences.ignoreCertificateErrors,
  rememberLastPageVisited: state.preferences.rememberLastPageVisited,
  shareWorkspaceBrowsingData: state.preferences.shareWorkspaceBrowsingData,
});

export default connectComponent(
  SectionBrowsing,
  mapStateToProps,
  null,
  styles,
);
