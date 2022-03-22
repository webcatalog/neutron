/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';

import makeStyles from '@mui/styles/makeStyles';

import { useSelector } from 'react-redux';

import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import autoHibernateTimeouts from '../../../constants/auto-hibernate-timeouts';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
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
}));

const SectionPerformance = () => {
  const classes = useStyles();

  const hibernateUnusedWorkspacesAtLaunch = useSelector(
    (state) => state.preferences.hibernateUnusedWorkspacesAtLaunch,
  );
  const hibernateWhenUnused = useSelector((state) => state.preferences.hibernateWhenUnused);
  const hibernateWhenUnusedTimeout = useSelector(
    (state) => state.preferences.hibernateWhenUnusedTimeout,
  );

  return (
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
};

export default SectionPerformance;
