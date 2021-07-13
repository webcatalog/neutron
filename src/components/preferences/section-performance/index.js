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
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import autoHibernateTimeouts from '../../../constants/auto-hibernate-timeouts';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const styles = (theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
  refreshEvery: {
    float: 'right',
    paddingRight: theme.spacing(1),
  },
});

const SectionPerformance = ({
  classes,
  hibernateWhenUnused,
  hibernateWhenUnusedTimeout,
  hibernateUnusedWorkspacesAtLaunch,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary={`Hibernate inactive ${getWorkspaceFriendlyName(true).toLowerCase()} automatically`}
        secondary={`When this is on, inactive ${getWorkspaceFriendlyName(true).toLowerCase()} will go to sleep after the specified time to save system resources.`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={hibernateWhenUnused}
          onChange={(e) => {
            requestSetPreference('hibernateWhenUnused', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
    <ListItem>
      <ListItemText
        primary={`Put inactive ${getWorkspaceFriendlyName(true).toLowerCase()} to sleep after`}
        classes={{ primary: classes.refreshEvery }}
      />
      <Select
        value={hibernateWhenUnusedTimeout}
        onChange={(e) => {
          requestSetPreference('hibernateWhenUnusedTimeout', e.target.value);
          enqueueRequestRestartSnackbar();
        }}
        variant="filled"
        disableUnderline
        margin="dense"
        classes={{
          root: classes.select,
        }}
        className={classes.selectRoot}
        disabled={!hibernateWhenUnused}
      >
        {autoHibernateTimeouts.map((opt) => (
          <MenuItem key={opt.value} dense value={opt.value}>
            {opt.value > 0 ? `${opt.name} of inactivity` : opt.name}
          </MenuItem>
        ))}
      </Select>
    </ListItem>
    <Divider />
    <ListItem>
      <ListItemText
        primary={`Hibernate inactive ${getWorkspaceFriendlyName(true).toLowerCase()} at launch`}
        secondary={`When this is on, only the last active ${getWorkspaceFriendlyName(false).toLowerCase()} will be loaded when the app is started.`}
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
          checked={hibernateUnusedWorkspacesAtLaunch}
          onChange={(e) => {
            requestSetPreference('hibernateUnusedWorkspacesAtLaunch', e.target.checked);
            enqueueRequestRestartSnackbar();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionPerformance.propTypes = {
  classes: PropTypes.object.isRequired,
  hibernateUnusedWorkspacesAtLaunch: PropTypes.bool.isRequired,
  hibernateWhenUnused: PropTypes.bool.isRequired,
  hibernateWhenUnusedTimeout: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  hibernateUnusedWorkspacesAtLaunch: state.preferences.hibernateUnusedWorkspacesAtLaunch,
  hibernateWhenUnused: state.preferences.hibernateWhenUnused,
  hibernateWhenUnusedTimeout: state.preferences.hibernateWhenUnusedTimeout,
});

export default connectComponent(
  SectionPerformance,
  mapStateToProps,
  null,
  styles,
);
