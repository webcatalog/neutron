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

import makeStyles from '@mui/styles/makeStyles';

import { useDispatch, useSelector } from 'react-redux';

import { updateForm, save, close } from '../../../state/dialog-refresh-interval/actions';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'center',
  },
  textField: {
    marginRight: theme.spacing(1),
  },
  actions: {
    display: 'flex',
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));

const RefreshInterval = () => {
  const classes = useStyles();
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
      <DialogContent className={classes.content}>
        <TextField
          label="Refresh every"
          variant="filled"
          type="number"
          inputProps={{
            min: 0,
            step: 1,
          }}
          value={value}
          className={classes.textField}
          // prevent decimal with Math.floor
          onChange={(e) => dispatch(updateForm({ value: Math.floor(e.target.value) }))}
        />
        <FormControl variant="filled" className={classes.formControl}>
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
        <div className={classes.actions}>
          <div className={classes.actionsRight}>
            <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={() => dispatch(save())}>
              Save
            </Button>
            <Button variant="contained" disableElevation className={classes.button} onClick={() => dispatch(close())}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default RefreshInterval;
