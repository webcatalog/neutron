/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { getCurrentWindow } from '@electron/remote';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { updateForm, login } from '../../state/dialog-auth/actions';

const Auth = () => {
  const dispatch = useDispatch();

  const username = useSelector((state) => state.dialogAuth.form.username);
  const password = useSelector((state) => state.dialogAuth.form.password);

  return (
    <Box
      sx={{
        background: 'background.paper',
        height: 1,
        width: 1,
        p: 2,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <TextField
          sx={{ mb: 2 }}
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
      </Box>
      <Box>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          sx={{
            float: 'right',
            ml: 1,
          }}
          onClick={() => dispatch(login())}
        >
          Sign in
        </Button>
        <Button
          variant="contained"
          disableElevation
          sx={{
            float: 'right',
            ml: 1,
          }}
          onClick={() => getCurrentWindow().close()}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default Auth;
