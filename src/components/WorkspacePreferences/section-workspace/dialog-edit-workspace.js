/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import connectComponent from '../../../helpers/connect-component';
import getMailtoUrl from '../../../helpers/get-mailto-url';
import getWebcalUrl from '../../../helpers/get-webcal-url';
import getStaticGlobal from '../../../helpers/get-static-global';

import {
  updateForm,
  save,
  close,
} from '../../../state/dialog-edit-workspace/actions';

const styles = (theme) => ({
  textField: {
    marginBottom: theme.spacing(3),
  },
});

const EditWorkspace = ({
  accountInfo,
  classes,
  homeUrl,
  homeUrlError,
  isCalendarApp,
  isMailApp,
  name,
  onClose,
  onSave,
  onUpdateForm,
  open,
}) => {
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
      onClose={onClose}
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
          onChange={(e) => onUpdateForm({ name: e.target.value })}
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
          onChange={(e) => onUpdateForm({ homeUrl: e.target.value })}
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
        <Button color="default" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditWorkspace.defaultProps = {
  accountInfo: null,
  homeUrlError: null,
};

EditWorkspace.propTypes = {
  accountInfo: PropTypes.object,
  classes: PropTypes.object.isRequired,
  homeUrl: PropTypes.string.isRequired,
  homeUrlError: PropTypes.string,
  isCalendarApp: PropTypes.bool.isRequired,
  isMailApp: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  accountInfo: state.dialogEditWorkspace.form.accountInfo,
  homeUrl: state.dialogEditWorkspace.form.homeUrl || '',
  homeUrlError: state.dialogEditWorkspace.form.homeUrlError,
  isCalendarApp: Boolean(getWebcalUrl(state.dialogEditWorkspace.form.homeUrl)),
  isMailApp: Boolean(getMailtoUrl(state.dialogEditWorkspace.form.homeUrl)),
  name: state.dialogEditWorkspace.form.name || '',
  open: state.dialogEditWorkspace.open,
});

const actionCreators = {
  updateForm,
  save,
  close,
};

export default connectComponent(
  EditWorkspace,
  mapStateToProps,
  actionCreators,
  styles,
);
