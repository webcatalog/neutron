/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import PropTypes from 'prop-types';
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import AddCircleIcon from '@material-ui/icons/AddCircle';

import connectComponent from '../../helpers/connect-component';
import { requestOpenInBrowser } from '../../senders';

const styles = (theme) => ({
  card: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing(1.5),
    display: 'flex',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.action.selected,
    },
    textAlign: 'left',
    marginTop: theme.spacing(2),
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 1,
    fontWeight: 500,
  },
  appUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  paperIcon: {
    fontSize: '64px',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flex: 1,
  },
});

const SubmitAppCard = (props) => {
  const {
    classes,
  } = props;

  return (
    <Grid item xs={12}>
      <Paper elevation={0} className={classes.card} onClick={() => requestOpenInBrowser('https://forms.gle/redZCVMwkuhvuDtb9')}>
        <div>
          <AddCircleIcon className={classes.paperIcon} />
        </div>
        <div className={classes.infoContainer}>
          <Typography variant="subtitle1" className={classes.appName}>
            Submit New Service
          </Typography>
          <Typography variant="body2" color="textSecondary" className={classes.appUrl}>
            Can&apos;t find your favorite app/service? Submit it!
          </Typography>
        </div>
      </Paper>
    </Grid>
  );
};

SubmitAppCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connectComponent(
  SubmitAppCard,
  null,
  null,
  styles,
);
