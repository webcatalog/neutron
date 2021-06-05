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

import connectComponent from '../../../helpers/connect-component';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import { close, updateForm, save } from '../../../state/dialog-internal-urls/actions';

import {
  requestOpenInBrowser,
} from '../../../senders';

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
        <Typography variant="body2">
          {`Internal URLs are links that open within ${appJson.name} instead of in your default browser.`}
        </Typography>

        <Typography variant="body2">
          {`By default, ${appJson.name} detects internal URLs based on the app domain and other factors.`}
        </Typography>

        <Typography variant="body2">
          <span>You can use </span>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              requestOpenInBrowser('https://en.wikipedia.org/wiki/Regular_expression');
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://en.wikipedia.org/wiki/Regular_expression');
            }}
          >
            regular expression (regexp)
          </Link>
          <span> to define additional rules for detecting internal URLs. </span>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              requestOpenInBrowser(`https://webcatalog.app/internal-urls?utm_source=${utmSource}`);
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser(`https://webcatalog.app/internal-urls?utm_source=${utmSource}`);
            }}
          >
            Learn more
          </Link>
        </Typography>

        <br />

        <TextField
          autoFocus
          label="Internal URL rule"
          placeholder=""
          helperText={(() => {
            if (internalUrlRuleError) return internalUrlRuleError;
            if (window.mode === 'workspace-preferences') return 'Leave it blank to use global preference.';
            return 'Regular expression (regexp)';
          })()}
          fullWidth
          margin="dense"
          variant="outlined"
          multiline={false}
          InputLabelProps={{
            shrink: true,
          }}
          value={internalUrlRule}
          error={Boolean(internalUrlRuleError)}
          onChange={(e) => onUpdateForm({ internalUrlRule: e.target.value })}
          InputProps={{
            startAdornment: <InputAdornment position="start">/^</InputAdornment>,
            endAdornment: <InputAdornment position="end">$/i</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disableElevation onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" disableElevation onClick={onSave}>
          Save
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
