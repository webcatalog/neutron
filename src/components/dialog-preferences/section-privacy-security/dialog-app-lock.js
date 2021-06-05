/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import connectComponent from '../../../helpers/connect-component';

import {
  close,
  updateForm,
  save,
  validateCurrentPassword,
  deletePassword,
} from '../../../state/dialog-app-lock/actions';

import { requestOpenInBrowser } from '../../../senders';

const styles = (theme) => ({
  actions: {
    display: 'flex',
    width: '100%',
  },
  actionsLeft: {
    flex: 1,
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
});

const DialogAppLock = ({
  classes,
  password,
  passwordError,
  onClose,
  onSave,
  onUpdateForm,
  open,
  requireCurrentPassword,
  onValidateCurrentPassword,
  onDeletePassword,
  currentPassword,
  currentPasswordError,
  useTouchId,
  hasPassword,
}) => {
  const [revealPassword, setRevealPassword] = useState(false);
  const canPromptTouchId = window.process.platform === 'darwin'
    && window.remote.systemPreferences.canPromptTouchID();

  // https://github.com/atom/node-keytar
  let vaultName;
  switch (window.process.platform) {
    case 'darwin':
      vaultName = 'Apple Keychain';
      break;
    case 'linux':
      vaultName = 'Secret Service API/libsecret';
      break;
    case 'win32':
      vaultName = 'Windows Credential Manager';
      break;
    default:
      vaultName = 'Unknown Vault';
  }

  const passwordRecovery = (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        requestOpenInBrowser('https://help.webcatalog.app/article/27-how-to-reset-my-app-lock-password');
      }}
    >
      Forgot your password?
    </Link>
  );

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      {requireCurrentPassword ? (
        <DialogContent>
          <Typography variant="body2">
            Enter your current password to continue.
          </Typography>
          <br />

          <TextField
            autoFocus
            label="Password"
            placeholder="Current password"
            helperText={currentPasswordError
              ? (
                <>
                  <span>{currentPasswordError}</span>
                  &nbsp;
                  {passwordRecovery}
                </>
              ) : passwordRecovery}
            fullWidth
            margin="dense"
            variant="outlined"
            multiline={false}
            InputLabelProps={{
              shrink: true,
            }}
            value={currentPassword}
            error={Boolean(currentPasswordError)}
            onChange={(e) => onUpdateForm({
              currentPassword: e.target.value,
              currentPasswordError: null,
            })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onValidateCurrentPassword();
                e.target.blur();
              }
            }}
            type={revealPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={revealPassword ? 'Hide Password' : 'Reveal Password'}
                    onClick={() => setRevealPassword(!revealPassword)}
                    onMouseDown={() => setRevealPassword(!revealPassword)}
                  >
                    {revealPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <Typography variant="body2">
            CAUTION: Experimental. Use at your own risk.
          </Typography>
          <br />

          <TextField
            autoFocus
            label="Password"
            placeholder={hasPassword ? 'Leave this blank if you want no change' : 'Set a password'}
            helperText={passwordError || `Password is stored locally and securely by ${vaultName}.`}
            fullWidth
            margin="dense"
            variant="outlined"
            multiline={false}
            InputLabelProps={{
              shrink: true,
            }}
            value={password}
            error={Boolean(passwordError)}
            onChange={(e) => onUpdateForm({ password: e.target.value })}
            type={revealPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={revealPassword ? 'Hide Password' : 'Reveal Password'}
                    onClick={() => setRevealPassword(!revealPassword)}
                    onMouseDown={() => setRevealPassword(!revealPassword)}
                  >
                    {revealPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
      )}
      <DialogActions>
        <div className={classes.actions}>
          <div className={classes.actionsLeft}>
            {hasPassword && !requireCurrentPassword && (
              <Button variant="contained" disableElevation onClick={onDeletePassword}>
                Disable App Lock
              </Button>
            )}
          </div>
          <div className={classes.actionsRight}>
            {!requireCurrentPassword && canPromptTouchId && (
              <FormControlLabel
                control={(
                  <Switch
                    checked={useTouchId}
                    onChange={(e) => onUpdateForm({ useTouchId: e.target.checked })}
                    color="primary"
                  />
                )}
                label="Use Touch ID"
              />
            )}
          </div>
          <div className={classes.actionsRight}>
            <Button variant="contained" className={classes.button} disableElevation onClick={onClose}>
              Cancel
            </Button>
            {!requireCurrentPassword ? (
              <Button color="primary" className={classes.button} variant="contained" disableElevation onClick={onSave}>
                Save
              </Button>
            ) : (
              <Button color="primary" className={classes.button} variant="contained" disableElevation onClick={onValidateCurrentPassword}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};
DialogAppLock.defaultProps = {
  currentPassword: '',
  currentPasswordError: null,
  hasPassword: false,
  open: false,
  password: '',
  passwordError: null,
  requireCurrentPassword: false,
  useTouchId: false,
};

DialogAppLock.propTypes = {
  classes: PropTypes.object.isRequired,
  currentPassword: PropTypes.string,
  currentPasswordError: PropTypes.string,
  hasPassword: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onDeletePassword: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  onValidateCurrentPassword: PropTypes.func.isRequired,
  open: PropTypes.bool,
  password: PropTypes.string,
  passwordError: PropTypes.string,
  requireCurrentPassword: PropTypes.bool,
  useTouchId: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  currentPassword: state.dialogAppLock.form.currentPassword,
  currentPasswordError: state.dialogAppLock.form.currentPasswordError,
  hasPassword: state.dialogAppLock.form.hasPassword,
  open: state.dialogAppLock.open,
  password: state.dialogAppLock.form.password,
  passwordError: state.dialogAppLock.form.passwordError,
  requireCurrentPassword: state.dialogAppLock.form.requireCurrentPassword,
  useTouchId: state.dialogAppLock.form.useTouchId,
});

const actionCreators = {
  close,
  updateForm,
  save,
  validateCurrentPassword,
  deletePassword,
};

export default connectComponent(
  DialogAppLock,
  mapStateToProps,
  actionCreators,
  styles,
);
