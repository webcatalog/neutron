/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';

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

import { makeStyles } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import {
  close,
  updateForm,
  save,
  validateCurrentPassword,
  deletePassword,
} from '../../../state/dialog-app-lock/actions';

import { requestOpenInBrowser } from '../../../senders';

import getKeytarVaultName from '../../../helpers/get-keytar-vault-name';

const useStyles = makeStyles((theme) => ({
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
}));

const DialogAppLock = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const currentPassword = useSelector((state) => state.dialogAppLock.form.currentPassword);
  // eslint-disable-next-line max-len
  const currentPasswordError = useSelector((state) => state.dialogAppLock.form.currentPasswordError);
  const hasPassword = useSelector((state) => state.dialogAppLock.form.hasPassword);
  const open = useSelector((state) => state.dialogAppLock.open);
  const password = useSelector((state) => state.dialogAppLock.form.password);
  const passwordError = useSelector((state) => state.dialogAppLock.form.passwordError);
  // eslint-disable-next-line max-len
  const requireCurrentPassword = useSelector((state) => state.dialogAppLock.form.requireCurrentPassword);
  const useTouchId = useSelector((state) => state.dialogAppLock.form.useTouchId);

  const [revealPassword, setRevealPassword] = useState(false);
  const canPromptTouchId = window.process.platform === 'darwin'
    && window.remote.systemPreferences.canPromptTouchID();

  const vaultName = getKeytarVaultName();

  const passwordRecovery = (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        requestOpenInBrowser('https://docs.webcatalog.io/article/27-how-to-reset-my-app-lock-password');
      }}
    >
      Forgot your password?
    </Link>
  );

  return (
    <Dialog
      onClose={dispatch(close)}
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
            onChange={(e) => dispatch(updateForm({
              currentPassword: e.target.value,
              currentPasswordError: null,
            }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                dispatch(validateCurrentPassword());
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
            onChange={(e) => dispatch(updateForm({ password: e.target.value }))}
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
              <Button variant="contained" disableElevation onClick={dispatch(deletePassword)}>
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
                    onChange={(e) => dispatch(updateForm({ useTouchId: e.target.checked }))}
                    color="primary"
                  />
                )}
                label="Use Touch ID"
              />
            )}
          </div>
          <div className={classes.actionsRight}>
            <Button variant="contained" className={classes.button} disableElevation onClick={dispatch(close)}>
              Cancel
            </Button>
            {!requireCurrentPassword ? (
              <Button color="primary" className={classes.button} variant="contained" disableElevation onClick={dispatch(save)}>
                Save
              </Button>
            ) : (
              <Button color="primary" className={classes.button} variant="contained" disableElevation onClick={dispatch(validateCurrentPassword)}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAppLock;
