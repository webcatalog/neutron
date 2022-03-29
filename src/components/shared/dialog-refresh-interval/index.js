/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import { updateForm, save, close } from '../../../state/dialog-refresh-interval/actions';

const RefreshInterval = () => {
  const dispatch = useDispatch();

  const value = useSelector((state) => state.dialogRefreshInterval.form.value);
  const unit = useSelector((state) => state.dialogRefreshInterval.form.unit);
  const open = useSelector((state) => state.dialogRefreshInterval.open);

  return (
    <Dialog
      onClose={() => dispatch(close())}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <TextField
          label="Refresh every"
          variant="filled"
          type="number"
          inputProps={{
            min: 0,
            step: 1,
          }}
          value={value}
          sx={{
            mr: 1,
          }}
          // prevent decimal with Math.floor
          onChange={(e) => dispatch(updateForm({ value: Math.floor(e.target.value) }))}
        />
        <FormControl variant="filled">
          <InputLabel id="unit-label">Unit</InputLabel>
          <Select
            labelId="unit-label"
            value={unit}
            onChange={(e) => dispatch(updateForm({ unit: e.target.value }))}
          >
            {['hours', 'minutes', 'seconds', 'milliseconds'].map((u) => (
              <MenuItem key={u} value={u}>{u}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Box sx={{ display: 'flex' }}>
          <Box>
            <Button
              color="primary"
              variant="contained"
              disableElevation
              sx={{
                float: 'right',
                ml: 1,
              }}
              onClick={() => dispatch(save())}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="inherit"
              sx={{
                float: 'right',
                ml: 1,
                ':hover': {
                  bgcolor: 'rgb(0 0 0 / 16%)',
                },
              }}
              disableElevation
              onClick={() => dispatch(close())}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default RefreshInterval;
