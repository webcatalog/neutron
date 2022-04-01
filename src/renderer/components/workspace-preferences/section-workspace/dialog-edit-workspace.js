/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import getMailtoUrl from '../../../helpers/get-mailto-url';
import getWebcalUrl from '../../../helpers/get-webcal-url';
import getStaticGlobal from '../../../helpers/get-static-global';

import {
  updateForm,
  close,
} from '../../../state/dialog-edit-workspace/actions';

const EditWorkspace = () => {
  const dispatch = useDispatch();

  const accountInfo = useSelector((state) => state.dialogEditWorkspace.form.accountInfo);
  const homeUrl = useSelector((state) => state.dialogEditWorkspace.form.homeUrl || '');
  const homeUrlError = useSelector((state) => state.dialogEditWorkspace.form.homeUrlError);
  const name = useSelector((state) => state.dialogEditWorkspace.form.name || '');
  const open = useSelector((state) => state.dialogEditWorkspace.open);

  const isMailApp = getMailtoUrl(homeUrl);
  const isCalendarApp = getWebcalUrl(homeUrl);

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
          sx={{ mb: 3 }}
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
          sx={{ mb: 3 }}
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
        <Button
          variant="contained"
          onClick={() => dispatch(close())}
          color="inherit"
          sx={{
            ':hover': {
              backgroundColor: 'rgb(0 0 0 / 16%)',
            },
          }}
        >
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
