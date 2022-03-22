/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  root: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },
  icon: {
    height: 64,
    width: 64,
  },
  tryAgainButton: {
    marginTop: 16,
  },
}));

const NoConnection = (props) => {
  const {
    onTryAgainButtonClick,
  } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ErrorIcon className={classes.icon} color="disabled" />
      <br />
      <Typography
        color="textSecondary"
        variant="h6"
      >
        Failed to Connect to Server
      </Typography>
      <Typography
        align="center"
        variant="subtitle1"
      >
        Please check your Internet connection.
      </Typography>
      <Button
        className={classes.tryAgainButton}
        color="primary"
        onClick={onTryAgainButtonClick}
      >
        Try Again
      </Button>
    </div>
  );
};

NoConnection.propTypes = {
  onTryAgainButtonClick: PropTypes.func.isRequired,
};

export default NoConnection;
