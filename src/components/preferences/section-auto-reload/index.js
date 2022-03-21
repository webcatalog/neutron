/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import roundTime from '../../../helpers/round-time';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  enqueueRequestRestartSnackbar,
  requestOpenInBrowser,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogRefreshInterval } from '../../../state/dialog-refresh-interval/actions';

import autoRefreshIntervals from '../../../constants/auto-refresh-intervals';

import DialogRefreshInterval from '../../shared/dialog-refresh-interval';

const useStyles = makeStyles((theme) => ({
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
  refreshEvery: {
    float: 'right',
    paddingRight: theme.spacing(1),
  },
}));

const SectionAutoReload = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const autoRefresh = useSelector((state) => state.preferences.autoRefresh);
  const autoRefreshInterval = useSelector((state) => state.preferences.autoRefreshInterval);
  const autoRefreshOnlyWhenInactive = useSelector(
    (state) => state.preferences.autoRefreshOnlyWhenInactive,
  );

  return (
    <>
      <List disablePadding dense>
        <ListItem>
          <ListItemText
            primary="Reload web pages automatically"
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={autoRefresh}
              onChange={(e) => {
                requestSetPreference('autoRefresh', e.target.checked);
                enqueueRequestRestartSnackbar();
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText primary="Reload every" classes={{ primary: classes.refreshEvery }} />
          <Select
            value={autoRefreshInterval}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                dispatch(openDialogRefreshInterval());
                return;
              }
              requestSetPreference('autoRefreshInterval', e.target.value);
              enqueueRequestRestartSnackbar();
            }}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
            disabled={!autoRefresh}
          >
            {autoRefreshIntervals.map((opt) => (
              <MenuItem key={opt.value} dense value={opt.value}>{opt.name}</MenuItem>
            ))}
            {(() => {
              const isCustom = autoRefreshIntervals
                .find((interval) => interval.value === autoRefreshInterval) == null;
              if (isCustom) {
                const time = roundTime(autoRefreshInterval);
                return (
                  <MenuItem dense value={autoRefreshInterval}>
                    {`${time.value} ${time.unit}`}
                  </MenuItem>
                );
              }
              return null;
            })()}
            <MenuItem dense value="custom">Custom</MenuItem>
          </Select>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Only reload on inactivity"
            secondary={(
              <>
                <span>Keep certain apps from logging </span>
                <span>out automatically when you are away. </span>
                <span
                  role="link"
                  tabIndex={0}
                  className={classes.link}
                  onClick={() => requestOpenInBrowser(`https://docs.webcatalog.io/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${getUtmSource()}`)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    requestOpenInBrowser(`https://docs.webcatalog.io/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${getUtmSource()}`);
                  }}
                >
                  Learn more
                </span>
                <span>.</span>
              </>
            )}
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={autoRefreshOnlyWhenInactive}
              disabled={!autoRefresh}
              onChange={(e) => {
                requestSetPreference('autoRefreshOnlyWhenInactive', e.target.checked);
                enqueueRequestRestartSnackbar();
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </List>
      <DialogRefreshInterval />
    </>
  );
};

export default SectionAutoReload;
