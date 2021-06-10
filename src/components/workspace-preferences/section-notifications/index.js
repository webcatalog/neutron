/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const SectionNotifications = ({
  formDisableNotifications,
  onUpdateForm,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary={`Prevent the ${getWorkspaceFriendlyName().toLowerCase()} from sending notifications`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={formDisableNotifications}
          onChange={(e) => {
            onUpdateForm({
              disableNotifications: e.target.checked,
            });
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionNotifications.propTypes = {
  onUpdateForm: PropTypes.func.isRequired,
  formDisableNotifications: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  formDisableNotifications: Boolean(state.dialogWorkspacePreferences.form.disableNotifications),
});

const actionCreators = {
  updateForm,
};

export default connectComponent(
  SectionNotifications,
  mapStateToProps,
  actionCreators,
);
