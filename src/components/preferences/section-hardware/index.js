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

import connectComponent from '../../../helpers/connect-component';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import DialogInternalUrls from '../../shared/dialog-internal-urls';
import DialogRefreshInterval from '../../shared/dialog-refresh-interval';

const SectionHardward = ({
  swipeToNavigate,
  useHardwareAcceleration,
}) => (
  <>
    <List disablePadding dense>
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
    </List>
    <DialogInternalUrls />
    <DialogRefreshInterval />
  </>
);

SectionHardward.propTypes = {
  swipeToNavigate: PropTypes.bool.isRequired,
  useHardwareAcceleration: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  swipeToNavigate: state.preferences.swipeToNavigate,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
});

export default connectComponent(
  SectionHardward,
  mapStateToProps,
  null,
);
