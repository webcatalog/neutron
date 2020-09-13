import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';

import { close, updateForm, save } from '../../state/dialog-custom-user-agent/actions';

const CustomUserAgent = ({
  code,
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
        id="outlined-full-width"
        label="User-Agent"
        placeholder=""
        helperText="Leave it blank to use default User-Agent string."
        fullWidth
        margin="dense"
        variant="outlined"
        multiline={false}
        InputLabelProps={{
          shrink: true,
        }}
        value={code}
        onChange={(e) => onUpdateForm({ code: e.target.value })}
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
  code: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  code: state.dialogCustomUserAgent.form.code || '',
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
