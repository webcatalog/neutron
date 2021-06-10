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

import connectComponent from '../../../helpers/connect-component';

import {
  requestSetPreference,
} from '../../../senders';

const SectionBadge = ({
  unreadCountBadge,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText primary="Show unread count badge" />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={unreadCountBadge}
          onChange={(e) => {
            requestSetPreference('unreadCountBadge', e.target.checked);
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionBadge.propTypes = {
  unreadCountBadge: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  unreadCountBadge: state.preferences.unreadCountBadge,
});

export default connectComponent(
  SectionBadge,
  mapStateToProps,
);
