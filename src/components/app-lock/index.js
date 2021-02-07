/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';

import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import LockIcon from '@material-ui/icons/Lock';

import connectComponent from '../../helpers/connect-component';
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

const styles = (theme) => ({
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
});

const AppLock = ({
  classes,
  onUpdateForm,
  onValidateForm,
  password,
  passwordError,
}) => {
  const appJson = getStaticGlobal('appJson');
  const [revealPassword, setRevealPassword] = useState(false);
  const [useTouchId, setUseTouchId] = useState(false);

  useEffect(() => {
    getAppLockStatusAsync()
      .then((status) => {
        setUseTouchId(Boolean(status.useTouchId));
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
              requestOpenInBrowser('https://help.webcatalog.app/article/27-how-to-reset-my-app-lock-password');
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
              onChange={(e) => onUpdateForm({
                password: e.target.value,
                passwordError: null,
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onValidateForm();
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
              onClick={onValidateForm}
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

AppLock.defaultProps = {
  password: '',
  passwordError: null,
};

AppLock.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  onValidateForm: PropTypes.func.isRequired,
  password: PropTypes.string,
  passwordError: PropTypes.string,
};

const mapStateToProps = (state) => ({
  password: state.appLock.form.password,
  passwordError: state.appLock.form.passwordError,
});

const actionCreators = {
  updateForm,
  validateForm,
};

export default connectComponent(
  AppLock,
  mapStateToProps,
  actionCreators,
  styles,
);
