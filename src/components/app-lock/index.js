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

import makeStyles from '@mui/styles/makeStyles';

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

const useStyles = makeStyles((theme) => ({
  outerRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    WebkitAppRegion: 'drag',
    userSelect: 'none',
  },
  centering: {
    maxWidth: 512,
    width: '100%',
    WebkitAppRegion: 'no-drag',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  inputContainerLeft: {
    flex: 1,
  },
  inputContainerRight: {
    height: '100%',
  },
  inputRoot: {
    borderTopRightRadius: 0,
  },
  unlockButton: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    height: '100%',
  },
  leftCorner: {
    WebkitAppRegion: 'no-drag',
    userSelect: 'text',
    position: 'absolute',
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  rightCorner: {
    WebkitAppRegion: 'no-drag',
    userSelect: 'text',
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  touchIdButton: {
    marginTop: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
    boxShadow: 'none',
    '&:hover': {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
    },
  },
  touchIdIcon: {
    width: 48,
    height: 48,
  },
}));

const AppLock = () => {
  const classes = useStyles();
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
    <div className={classes.outerRoot}>
      <div className={classes.leftCorner}>
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
      </div>
      <div className={classes.rightCorner}>
        <Typography variant="body2" color="textSecondary">
          {`Ref ID: ${appJson.id}`}
        </Typography>
      </div>
      <div className={classes.centering}>
        <div className={classes.inputContainer}>
          <div className={classes.inputContainerLeft}>
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
                classes: {
                  root: classes.inputRoot,
                },
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
          </div>
          <div className={classes.inputContainerRight}>
            <Button
              variant="contained"
              color="primary"
              className={classes.unlockButton}
              startIcon={<LockIcon />}
              disableElevation
              onClick={() => dispatch(validateForm())}
            >
              Unlock
            </Button>
          </div>
        </div>

        {useTouchId && (
          <Tooltip title="Unlock with Touch ID" placement="bottom">
            <Fab
              aria-label="Unlock with Touch ID"
              className={classes.touchIdButton}
              onClick={requestUnlockAppUsingTouchId}
            >
              <img src={touchIdIcon} alt="Touch ID" className={classes.touchIdIcon} />
            </Fab>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default AppLock;
