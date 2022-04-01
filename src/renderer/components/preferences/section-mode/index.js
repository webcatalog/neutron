/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const SectionMode = () => {
  const shareWorkspaceBrowsingData = useSelector(
    (state) => state.preferences.shareWorkspaceBrowsingData,
  );

  return (
    <List disablePadding dense>
      <ListItem
        disableGutters
        sx={{
          pl: 1,
        }}
      >
        <Box
          sx={{
            pt: 1,
            pb: 1.5,
          }}
        >
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
        </Box>
      </ListItem>
    </List>
  );
};

export default SectionMode;
