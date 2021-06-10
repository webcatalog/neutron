/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import connectComponent from '../../../helpers/connect-component';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const styles = (theme) => ({
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
});

const SectionBadge = ({
  classes,
  unreadCountBadge,
  formUnreadCountBadge,
  onUpdateForm,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary="Show unread count badge"
      />
      <Select
        value={formUnreadCountBadge === false ? formUnreadCountBadge : 'global'}
        onChange={(e) => onUpdateForm({
          preferences: {
            unreadCountBadge: e.target.value !== 'global' ? e.target.value : null,
          },
        })}
        variant="filled"
        disableUnderline
        margin="dense"
        classes={{
          root: classes.select,
        }}
        className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
      >
        <MenuItem dense value="global">{`Use global preference (${unreadCountBadge ? 'Yes' : 'No'})`}</MenuItem>
        <MenuItem dense value={false}>No</MenuItem>
      </Select>
    </ListItem>
  </List>
);

SectionBadge.defaultProps = {
  formUnreadCountBadge: null,
};

SectionBadge.propTypes = {
  classes: PropTypes.object.isRequired,
  formUnreadCountBadge: PropTypes.bool,
  onUpdateForm: PropTypes.func.isRequired,
  unreadCountBadge: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  unreadCountBadge: state.preferences.unreadCountBadge,
  formUnreadCountBadge: state.dialogWorkspacePreferences.form.preferences.unreadCountBadge,
});

const actionCreators = {
  updateForm,
};

export default connectComponent(
  SectionBadge,
  mapStateToProps,
  actionCreators,
  styles,
);
