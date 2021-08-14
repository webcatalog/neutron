/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { Avatar, Grid, makeStyles, Paper, TextField } from '@material-ui/core';

const useStyle = makeStyles((theme) => ({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
}));

const AccountGroup = () => {
  const classes = useStyle();

  return (
    <Paper
      className={classes.container}
      elevation={0}
      square
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            // error={Boolean(nameError)}
            placeholder="Example"
            // helperText={nameError}
            fullWidth
            margin="dense"
            variant="outlined"
            // className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            // value={name}
            // onChange={(e) => onUpdateForm({ name: e.target.value })}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AccountGroup;
