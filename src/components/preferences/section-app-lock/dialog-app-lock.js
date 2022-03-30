/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { systemPreferences } from '@electron/remote';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { Box } from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

const DialogAppLock = () => {
  const dispatch = useDispatch();

  const currentPassword = useSelector((state) => state.dialogAppLock.form.currentPassword);
  const currentPasswordError = useSelector(
    (state) => state.dialogAppLock.form.currentPasswordError,
  );
  const hasPassword = useSelector((state) => state.dialogAppLock.form.hasPassword);
  const open = useSelector((state) => state.dialogAppLock.open);
  const password = useSelector((state) => state.dialogAppLock.form.password);
  const passwordError = useSelector((state) => state.dialogAppLock.form.passwordError);
  const requireCurrentPassword = useSelector(
    (state) => state.dialogAppLock.form.requireCurrentPassword,
  );
  const useTouchId = useSelector((state) => state.dialogAppLock.form.useTouchId);

  const [revealPassword, setRevealPassword] = useState(false);
  const canPromptTouchId = window.process.platform === 'darwin'
    && systemPreferences.canPromptTouchID();

  const vaultName = getKeytarVaultName();

  const passwordRecovery = (
    <Link
      underline="hover"
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
      onClose={() => dispatch(close())}
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
                    size="large"
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
                    size="large"
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
        <Box
          sx={{
            display: 'flex',
            width: 1,
          }}
        >
          <Box sx={{ flex: 1 }}>
            {hasPassword && !requireCurrentPassword && (
              <Button variant="contained" disableElevation onClick={() => dispatch(deletePassword())}>
                Disable App Lock
              </Button>
            )}
          </Box>
          <Box>
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
          </Box>
          <Box>
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
            {!requireCurrentPassword ? (
              <Button
                color="primary"
                sx={{
                  float: 'right',
                  ml: 1,
                }}
                variant="contained"
                disableElevation
                onClick={() => dispatch(save())}
              >
                Save
              </Button>
            ) : (
              <Button
                color="primary"
                sx={{
                  float: 'right',
                  ml: 1,
                }}
                variant="contained"
                disableElevation
                onClick={() => dispatch(validateCurrentPassword())}
              >
                Continue
              </Button>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DialogAppLock;
