/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { getCurrentWindow } from '@electron/remote';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import makeStyles from '@mui/styles/makeStyles';

import { useDispatch, useSelector } from 'react-redux';

import { updateForm, login } from '../../state/dialog-auth/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
}));

const Auth = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const username = useSelector((state) => state.dialogAuth.form.username);
  const password = useSelector((state) => state.dialogAuth.form.password);

  return (
    <div className={classes.root}>
      <div className={classes.flexGrow}>
        <TextField
          className={classes.textField}
          fullWidth
          label="Username"
          margin="dense"
          onChange={(e) => dispatch(updateForm({ username: e.target.value }))}
          placeholder=""
          value={username}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          fullWidth
          label="Password"
          margin="dense"
          onChange={(e) => dispatch(updateForm({ password: e.target.value }))}
          placeholder=""
          type="password"
          value={password}
          variant="outlined"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </div>
      <div>
        <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={() => dispatch(login())}>
          Sign in
        </Button>
        <Button variant="contained" disableElevation className={classes.button} onClick={() => getCurrentWindow().close()}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default Auth;
