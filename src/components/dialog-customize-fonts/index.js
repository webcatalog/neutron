/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import InputAdornment from '@material-ui/core/InputAdornment';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';
import getStaticGlobal from '../../helpers/get-static-global';
import getUtmSource from '../../helpers/get-utm-source';

import { close, updateForm, save } from '../../state/dialog-internal-urls/actions';

import {
  requestOpenInBrowser,
} from '../../senders';

const DialogInternalUrls = ({
  internalUrlRule,
  internalUrlRuleError,
  onClose,
  onSave,
  onUpdateForm,
  open,
}) => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        HELLO WORLD
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disableElevation onClick={onClose}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};
DialogInternalUrls.defaultProps = {
  open: false,
  internalUrlRule: '',
  internalUrlRuleError: null,
};

DialogInternalUrls.propTypes = {
  internalUrlRule: PropTypes.string,
  internalUrlRuleError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  internalUrlRule: state.dialogInternalUrls.form.internalUrlRule,
  internalUrlRuleError: state.dialogInternalUrls.form.internalUrlRuleError,
  open: state.dialogInternalUrls.open,
});

const actionCreators = {
  close,
  updateForm,
  save,
};

export default connectComponent(
  DialogInternalUrls,
  mapStateToProps,
  actionCreators,
  null,
);
