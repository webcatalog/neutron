/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';

import {
  enqueueRequestRestartSnackbar,
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
  classes,
  blockAds,
  blockJavascript,
  ignoreCertificateErrors,
}) => (
  <List disablePadding dense>
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
      <ListItemText
        primary="Disable Javascript"
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={blockJavascript}
          onChange={(e) => {
            requestSetPreference('blockJavascript', e.target.checked);
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
);

SectionBrowsing.propTypes = {
  blockAds: PropTypes.bool.isRequired,
  blockJavascript: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  ignoreCertificateErrors: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  blockAds: state.preferences.blockAds,
  blockJavascript: state.preferences.blockJavascript,
  ignoreCertificateErrors: state.preferences.ignoreCertificateErrors,
});

export default connectComponent(
  SectionBrowsing,
  mapStateToProps,
  null,
  styles,
);