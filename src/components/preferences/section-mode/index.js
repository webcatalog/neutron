/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';

import connectComponent from '../../../helpers/connect-component';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

const styles = (theme) => ({
  listItemModePicker: {
    paddingLeft: theme.spacing(1),
  },
  modePicker: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1.5),
  },
});

const SectionMode = ({
  classes,
  shareWorkspaceBrowsingData,
}) => (
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

SectionMode.propTypes = {
  classes: PropTypes.object.isRequired,
  shareWorkspaceBrowsingData: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  shareWorkspaceBrowsingData: state.preferences.shareWorkspaceBrowsingData,
});

export default connectComponent(
  SectionMode,
  mapStateToProps,
  null,
  styles,
);
