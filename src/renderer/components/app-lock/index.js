/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';

import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';

import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import getStaticGlobal from '../../helpers/get-static-global';

import { updateForm, validateForm } from '../../state/app-lock/actions';

import {
  requestOpenInBrowser,
  requestUnlockAppUsingTouchId,
} from '../../senders';

import {
  getAppLockStatusAsync,
} from '../../invokers';

import touchIdIcon from '../../images/touch-id-icon.svg';

const AppLock = () => {
  const dispatch = useDispatch();

  const password = useSelector((state) => state.appLock.form.password);
  const passwordError = useSelector((state) => state.appLock.form.passwordError);

  const appJson = getStaticGlobal('appJson');
  const [revealPassword, setRevealPassword] = useState(false);
  const [useTouchId, setUseTouchId] = useState(false);

  useEffect(() => {
    getAppLockStatusAsync()
      .then((status) => {
        const canUseTouchId = Boolean(status.useTouchId);
        setUseTouchId(canUseTouchId);

        if (canUseTouchId && window.mode === 'main') {
          requestUnlockAppUsingTouchId();
        }
      });
  }, [setUseTouchId]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 1,
        width: 1,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        WebkitAppRegion: 'drag',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          WebkitAppRegion: 'no-drag',
          userSelect: 'text',
          position: 'absolute',
          bottom: 16,
          left: 16,
        }}
      >
        <Typography variant="body2">
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              requestOpenInBrowser('https://docs.webcatalog.io/article/27-how-to-reset-my-app-lock-password');
            }}
          >
            Forgot your password?
          </Link>
        </Typography>
      </Box>
      <Box
        sx={{
          WebkitAppRegion: 'no-drag',
          userSelect: 'text',
          position: 'absolute',
          bottom: 16,
          right: 16,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {`Ref ID: ${appJson.id}`}
        </Typography>
      </Box>
      <Box
        sx={{
          maxWidth: 512,
          width: 1,
          WebkitAppRegion: 'no-drag',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: 1,
          }}
        >
          <Box
            sx={{ flex: 1 }}
          >
            <TextField
              autoFocus
              label="Password"
              fullWidth
              margin="none"
              variant="filled"
              multiline={false}
              value={password}
              error={Boolean(passwordError)}
              onChange={(e) => dispatch(updateForm({
                password: e.target.value,
                passwordError: null,
              }))}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  dispatch(validateForm());
                  e.target.blur();
                }
              }}
              type={revealPassword ? 'text' : 'password'}
              InputProps={{
                sx: { '& .MuiInputBase-root-MuiFilledInput-root': { borderTopRightRadius: 0 } },
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
          </Box>
          <Box
            sx={{ height: 1 }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: 1,
              }}
              startIcon={<LockIcon />}
              disableElevation
              onClick={() => dispatch(validateForm())}
            >
              Unlock
            </Button>
          </Box>
        </Box>

        {useTouchId && (
          <Tooltip title="Unlock with Touch ID" placement="bottom">
            <Fab
              aria-label="Unlock with Touch ID"
              sx={{
                mt: 2,
                bgcolor: 'background.paper',
                overflow: 'hidden',
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: 'background.paper',
                  boxShadow: 2,
                },
              }}
              onClick={requestUnlockAppUsingTouchId}
            >
              <Box
                component="img"
                src={touchIdIcon}
                alt="Touch ID"
                sx={{
                  width: 48,
                  height: 48,
                }}
              />
            </Fab>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default AppLock;
