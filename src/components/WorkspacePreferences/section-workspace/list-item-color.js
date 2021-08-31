/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';

import ListItemIcon from '@material-ui/core/ListItemIcon';

import connectComponent from '../../../helpers/connect-component';
import camelCaseToSentenceCase from '../../../helpers/camel-case-to-sentence-case';

import themeColors from '../../../constants/theme-colors';

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
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
});

const ListItemColor = ({
  classes,
  color,
  onUpdateForm,
}) => (
  <ListItem>
    <ListItemText primary="Color" />
    <Select
      value={color == null ? 'none' : color}
      onChange={(e) => onUpdateForm({
        preferences: {
          color: e.target.value === 'none' ? null : e.target.value,
        },
      })}
      variant="filled"
      disableUnderline
      margin="dense"
      classes={{
        root: classes.select,
      }}
      className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
      // renderValue={(value) => camelCaseToSentenceCase(value)}
    >
      <MenuItem dense value="none">None</MenuItem>
      {Object.keys(themeColors).map((val) => (
        <MenuItem dense value={val} key={val}>
          <ListItemIcon>
            <Avatar className={classes.avatar} style={{ backgroundColor: themeColors[val][600] }}>{' '}</Avatar>
          </ListItemIcon>
          <ListItemText primary={camelCaseToSentenceCase(val)} />
        </MenuItem>
      ))}
    </Select>
  </ListItem>
);

ListItemColor.defaultProps = {
  color: null,
};

ListItemColor.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.string,
  onUpdateForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  color: state.dialogWorkspacePreferences.form.preferences.color,
});

const actionCreators = { updateForm };

export default connectComponent(
  ListItemColor,
  mapStateToProps,
  actionCreators,
  styles,
);
