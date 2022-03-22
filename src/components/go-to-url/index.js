/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';

import { updateForm, go } from '../../state/dialog-go-to-url/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
}));

const GoToUrl = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const urlError = useSelector((state) => state.dialogGoToUrl.urlError);
  const url = useSelector((state) => state.dialogGoToUrl.url);

  return (
    <div className={classes.root}>
      <div className={classes.flexGrow}>
        <TextField
          autoFocus
          label="URL"
          error={Boolean(urlError)}
          helperText={urlError}
          placeholder="Type a URL"
          fullWidth
          margin="dense"
          variant="outlined"
          multiline={false}
          InputLabelProps={{
            shrink: true,
          }}
          value={url}
          onChange={(e) => dispatch(updateForm({ url: e.target.value }))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              dispatch(go());
              e.target.blur();
            }
          }}
        />
      </div>
      <div>
        <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={() => dispatch(go())}>
          Go
        </Button>
        <Button variant="contained" disableElevation className={classes.button} onClick={() => window.remote.getCurrentWindow().close()}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default GoToUrl;
