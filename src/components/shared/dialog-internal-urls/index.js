/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useDispatch, useSelector } from 'react-redux';

import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import { close, updateForm, save } from '../../../state/dialog-internal-urls/actions';

import {
  requestOpenInBrowser,
} from '../../../senders';

const DialogInternalUrls = () => {
  const dispatch = useDispatch();

  const internalUrlRule = useSelector((state) => state.dialogInternalUrls.form.internalUrlRule);
  const internalUrlRuleError = useSelector(
    (state) => state.dialogInternalUrls.form.internalUrlRuleError,
  );
  const open = useSelector((state) => state.dialogInternalUrls.open);

  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <Dialog
      onClose={() => dispatch(close())}
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
            underline="hover"
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
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              requestOpenInBrowser(`https://docs.webcatalog.io/article/16-how-to-define-internal-urls?utm_source=${utmSource}`);
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser(`https://docs.webcatalog.io/article/16-how-to-define-internal-urls?utm_source=${utmSource}`);
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
          onChange={(e) => dispatch(updateForm({ internalUrlRule: e.target.value }))}
          InputProps={{
            startAdornment: <InputAdornment position="start">/^</InputAdornment>,
            endAdornment: <InputAdornment position="end">$/i</InputAdornment>,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="inherit"
          sx={{
            ':hover': {
              backgroundColor: 'rgb(0 0 0 / 16%)',
            },
          }}
          disableElevation
          onClick={() => dispatch(close())}
        >
          Cancel
        </Button>
        <Button color="primary" variant="contained" disableElevation onClick={() => dispatch(save())}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogInternalUrls;
