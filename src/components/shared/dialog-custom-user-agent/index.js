/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useDispatch, useSelector } from 'react-redux';

import { close, updateForm, save } from '../../../state/dialog-custom-user-agent/actions';

const CustomUserAgent = () => {
  const dispatch = useDispatch();

  const customUserAgent = useSelector((state) => state.dialogCustomUserAgent.form.customUserAgent || '');
  const open = useSelector((state) => state.dialogCustomUserAgent.open);

  return (
    <Dialog
      onClose={() => dispatch(close())}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <TextField
          autoFocus
          label="User-Agent"
          placeholder=""
          helperText={window.mode === 'workspace-preferences'
            ? 'Leave it blank to use global preference.'
            : 'Leave it blank to use default User-Agent string.'}
          fullWidth
          margin="dense"
          variant="outlined"
          multiline={false}
          InputLabelProps={{
            shrink: true,
          }}
          value={customUserAgent}
          onChange={(e) => dispatch(updateForm({ customUserAgent: e.target.value }))}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disableElevation onClick={() => dispatch(close())}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" disableElevation onClick={() => dispatch(save())}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomUserAgent;
