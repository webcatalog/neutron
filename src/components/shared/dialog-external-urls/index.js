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

import { close, updateForm, save } from '../../../state/dialog-external-urls/actions';

import {
  requestOpenInBrowser,
} from '../../../senders';

const DialogExternalUrls = ({
  externalUrlRule,
  externalUrlRuleError,
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
          {`External URLs are links that open in your default browser instead of within ${appJson.name} app.`}
        </Typography>

        <Typography variant="body2">
          {`By default, ${appJson.name} detects external URLs based on the app domain and other factors.`}
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
          <span> to define additional rules for detecting external URLs. </span>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              requestOpenInBrowser(`https://docs.webcatalog.io/article/43-how-to-define-external-urls?utm_source=${utmSource}`);
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser(`https://docs.webcatalog.io/article/43-how-to-define-external-urls?utm_source=${utmSource}`);
            }}
          >
            Learn more
          </Link>
        </Typography>

        <br />

        <TextField
          autoFocus
          label="External URL rule"
          placeholder=""
          helperText={(() => {
            if (externalUrlRuleError) return externalUrlRuleError;
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
          value={externalUrlRule}
          error={Boolean(externalUrlRuleError)}
          onChange={(e) => onUpdateForm({ externalUrlRule: e.target.value })}
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
DialogExternalUrls.defaultProps = {
  open: false,
  externalUrlRule: '',
  externalUrlRuleError: null,
};

DialogExternalUrls.propTypes = {
  externalUrlRule: PropTypes.string,
  externalUrlRuleError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  externalUrlRule: state.dialogExternalUrls.form.externalUrlRule,
  externalUrlRuleError: state.dialogExternalUrls.form.externalUrlRuleError,
  open: state.dialogExternalUrls.open,
});

const actionCreators = {
  close,
  updateForm,
  save,
};

export default connectComponent(
  DialogExternalUrls,
  mapStateToProps,
  actionCreators,
  null,
);
