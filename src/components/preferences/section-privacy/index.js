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
import getStaticGlobal from '../../../helpers/get-static-global';

import {
  enqueueRequestRestartSnackbar,
  requestClearBrowsingData,
  requestSetPreference,
} from '../../../senders';

const SectionBrowsing = ({
  rememberLastPageVisited,
  shareWorkspaceBrowsingData,
}) => {
  const appJson = getStaticGlobal('appJson');

  return (
    <List disablePadding dense>
      <ListItem button onClick={requestClearBrowsingData}>
        <ListItemText primary="Clear browsing data" secondary="Clear cookies, cache, and more." />
        <ChevronRightIcon color="action" />
      </ListItem>
      {appJson.url && (
      <>
        <Divider />
        <ListItem>
          <ListItemText primary="Share browsing data between services & accounts" />
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
    </List>
  );
};

SectionBrowsing.propTypes = {
  rememberLastPageVisited: PropTypes.bool.isRequired,
  shareWorkspaceBrowsingData: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  rememberLastPageVisited: state.preferences.rememberLastPageVisited,
  shareWorkspaceBrowsingData: state.preferences.shareWorkspaceBrowsingData,
});

export default connectComponent(
  SectionBrowsing,
  mapStateToProps,
);
