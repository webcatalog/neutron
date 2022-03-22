/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import { makeStyles } from '@material-ui/core';

import { useSelector } from 'react-redux';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  listItemModePicker: {
    paddingLeft: theme.spacing(1),
  },
  modePicker: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1.5),
  },
}));

const SectionMode = () => {
  const classes = useStyles();

  const shareWorkspaceBrowsingData = useSelector(
    (state) => state.preferences.shareWorkspaceBrowsingData,
  );

  return (
    <List disablePadding dense>
      <ListItem disableGutters className={classes.listItemModePicker}>
        <div className={classes.modePicker}>
          <Grid container spacing={2}>
            <Grid item>
              <Radio
                checked={shareWorkspaceBrowsingData}
                onChange={(e) => {
                  requestSetPreference('shareWorkspaceBrowsingData', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
                color="primary"
              />
            </Grid>
            <Grid item xs>
              <Typography variant="body1" gutterBottom={false}>
                Single Account Mode
              </Typography>
              <Typography variant="body2" gutterBottom={false}>
                Use same login credentials across added services.
              </Typography>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item>
              <Radio
                checked={!shareWorkspaceBrowsingData}
                onChange={(e) => {
                  requestSetPreference('shareWorkspaceBrowsingData', !e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
                color="primary"
              />
            </Grid>
            <Grid item xs>
              <Typography variant="body1" gutterBottom={false}>
                Multiple Account Mode
              </Typography>
              <Typography variant="body2" gutterBottom={false}>
                Use different login credentials for each added service.
              </Typography>
            </Grid>
          </Grid>
        </div>
      </ListItem>
    </List>
  );
};

export default SectionMode;
