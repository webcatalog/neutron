/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import getMailtoUrl from '../../../helpers/get-mailto-url';
import getWebcalUrl from '../../../helpers/get-webcal-url';
import getStaticGlobal from '../../../helpers/get-static-global';

import {
  updateForm,
  close,
} from '../../../state/dialog-edit-workspace/actions';

const useStyles = makeStyles((theme) => ({
  textField: {
    marginBottom: theme.spacing(3),
  },
}));

const EditWorkspace = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const accountInfo = useSelector((state) => state.dialogEditWorkspace.form.accountInfo);
  const homeUrl = useSelector((state) => state.dialogEditWorkspace.form.homeUrl || '');
  const homeUrlError = useSelector((state) => state.dialogEditWorkspace.form.homeUrlError);
  const isCalendarApp = useSelector((state) => Boolean(
    getWebcalUrl(state.dialogEditWorkspace.form.homeUrl),
  ));
  const isMailApp = useSelector((state) => Boolean(
    getMailtoUrl(state.dialogEditWorkspace.form.homeUrl),
  ));
  const name = useSelector((state) => state.dialogEditWorkspace.form.name || '');
  const open = useSelector((state) => state.dialogEditWorkspace.open);

  const appJson = getStaticGlobal('appJson');

  let namePlaceholder = 'Optional';
  if (accountInfo) {
    if (accountInfo.name && accountInfo.email) {
      namePlaceholder = `${accountInfo.name} (${accountInfo.email})`;
    } else if (accountInfo.name) {
      namePlaceholder = accountInfo.name;
    }
  }

  return (
    <Dialog
      onClose={() => dispatch(close())}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <TextField
          label="Name"
          placeholder={namePlaceholder}
          fullWidth
          margin="dense"
          variant="outlined"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          value={name}
          onChange={(e) => dispatch(updateForm({ name: e.target.value }))}
        />
        <TextField
          label="Home URL"
          error={Boolean(homeUrlError)}
          placeholder="Optional"
          fullWidth
          margin="dense"
          variant="outlined"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          value={homeUrl}
          onChange={(e) => dispatch(updateForm({ homeUrl: e.target.value }))}
          helperText={(() => {
            if (!homeUrlError && isMailApp) {
              return 'Email app detected.';
            }
            if (!homeUrlError && isCalendarApp) {
              return 'Calendar app detected.';
            }
            if (!homeUrl && appJson.url) {
              return `Defaults to ${appJson.url}.`;
            }
            return homeUrlError;
          })()}
        />
      </DialogContent>
      <DialogActions>
        <Button color="default" variant="contained" onClick={() => dispatch(close())}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={() => dispatch(close())}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditWorkspace;
