/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../../helpers/connect-component';

import { close, updateForm, save } from '../../../state/dialog-custom-user-agent/actions';

const CustomUserAgent = ({
  customUserAgent,
  onClose,
  onSave,
  onUpdateForm,
  open,
}) => (
  <Dialog
    onClose={onClose}
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
        onChange={(e) => onUpdateForm({ customUserAgent: e.target.value })}
      />
    </DialogContent>
    <DialogActions>
      <Button variant="contained" disableElevation onClick={onClose}>
        Cancel
      </Button>
      <Button color="primary" variant="contained" disableElevation onClick={onSave}>
        Save
      </Button>
    </DialogActions>
  </Dialog>
);

CustomUserAgent.defaultProps = {
  open: false,
};

CustomUserAgent.propTypes = {
  customUserAgent: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  customUserAgent: state.dialogCustomUserAgent.form.customUserAgent || '',
  open: state.dialogCustomUserAgent.open,
});

const actionCreators = {
  close,
  updateForm,
  save,
};

export default connectComponent(
  CustomUserAgent,
  mapStateToProps,
  actionCreators,
  null,
);
