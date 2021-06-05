/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../../helpers/connect-component';

import { updateForm, save, close } from '../../../state/dialog-refresh-interval/actions';

const styles = (theme) => ({
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
});

const RefreshInterval = ({
  classes,
  onClose,
  onSave,
  onUpdateForm,
  open,
  unit,
  value,
}) => (
  <Dialog
    onClose={onClose}
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
        onChange={(e) => onUpdateForm({ value: Math.floor(e.target.value) })}
      />
      <FormControl variant="filled" className={classes.formControl}>
        <InputLabel id="unit-label">Unit</InputLabel>
        <Select
          labelId="unit-label"
          value={unit}
          onChange={(e) => onUpdateForm({ unit: e.target.value })}
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
          <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={onSave}>
            Save
          </Button>
          <Button variant="contained" disableElevation className={classes.button} onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </DialogActions>
  </Dialog>
);

RefreshInterval.defaultProps = {
  value: 0,
  unit: 'milliseconds',
  open: false,
};

RefreshInterval.propTypes = {
  classes: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
  unit: PropTypes.oneOf(['hours', 'minutes', 'seconds', 'milliseconds']),
  value: PropTypes.number,
};

const mapStateToProps = (state) => ({
  value: state.dialogRefreshInterval.form.value,
  unit: state.dialogRefreshInterval.form.unit,
  open: state.dialogRefreshInterval.open,
});

const actionCreators = {
  close,
  save,
  updateForm,
};

export default connectComponent(
  RefreshInterval,
  mapStateToProps,
  actionCreators,
  styles,
);
