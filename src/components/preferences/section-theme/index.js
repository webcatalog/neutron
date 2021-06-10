/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Avatar from '@material-ui/core/Avatar';

import ListItemIcon from '@material-ui/core/ListItemIcon';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import camelCaseToSentenceCase from '../../../helpers/camel-case-to-sentence-case';

import themeColors from '../../../constants/theme-colors';

import {
  requestSetPreference,
} from '../../../senders';

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

const SectionTheme = ({
  classes,
  themeSource,
  themeColor,
}) => (
  <>
    <List disablePadding dense>
      <ListItem>
        <ListItemText primary="Theme" />
        <Select
          value={themeSource}
          onChange={(e) => requestSetPreference('themeSource', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
        >
          <MenuItem dense value="system">System default</MenuItem>
          <MenuItem dense value="light">Light</MenuItem>
          <MenuItem dense value="dark">Dark</MenuItem>
        </Select>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Color" />
        <Select
          value={themeColor == null ? 'none' : themeColor}
          onChange={(e) => requestSetPreference('themeColor', e.target.value === 'none' ? null : e.target.value)}
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
          <MenuItem dense value="auto">
            {`Matches with active ${getWorkspaceFriendlyName().toLowerCase()}'s color`}
          </MenuItem>
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
    </List>
  </>
);

SectionTheme.defaultProps = {
  themeColor: null,
};

SectionTheme.propTypes = {
  classes: PropTypes.object.isRequired,
  themeSource: PropTypes.string.isRequired,
  themeColor: PropTypes.string,
};

const mapStateToProps = (state) => ({
  themeSource: state.preferences.themeSource,
  themeColor: state.preferences.themeColor,
});

export default connectComponent(
  SectionTheme,
  mapStateToProps,
  null,
  styles,
);
