/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';

import { close, updateForm, save } from '../../state/dialog-internal-urls/actions';

const DialogInternalUrls = ({
  onClose,
  open,
}) => (
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

DialogInternalUrls.defaultProps = {
  open: false,
};

DialogInternalUrls.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
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
