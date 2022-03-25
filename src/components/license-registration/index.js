/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { getCurrentWindow } from '@electron/remote';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import { Box, Typography } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import {
  updateForm,
  register,
} from '../../state/dialog-license-registration/actions';

import { requestOpenInBrowser } from '../../senders';

import getStaticGlobal from '../../helpers/get-static-global';
import getUtmSource from '../../helpers/get-utm-source';

const DialogLicenseRegistration = () => {
  const dispatch = useDispatch();

  const licenseKey = useSelector((state) => state.dialogLicenseRegistration.form.licenseKey);
  const licenseKeyError = useSelector(
    (state) => state.dialogLicenseRegistration.form.licenseKeyError,
  );

  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 1,
      }}
    >
      <DialogContent>
        <DialogContentText sx={{ mt: 2 }}>
          You are currently running the free version of&nbsp;
          {appJson.name}
          &nbsp;which does not include&nbsp;
          <span
            onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog/pricing/?utm_source=webcatalog_app')}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://webcatalog.io/webcatalog/pricing/?utm_source=webcatalog_app');
            }}
            role="link"
            tabIndex="0"
          >
            premium features
          </span>
          &nbsp;such as adding unlimited number of&nbsp;
          <span>{getWorkspaceFriendlyName(true).toLowerCase()}</span>
          ,
          blocking ads & trackers and more.
          To remove the limitations, please purchase&nbsp;
          {appJson.name}
          &nbsp;Plus from our website.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id=""
          label="License Key"
          margin="normal"
          onChange={(e) => dispatch(updateForm({ licenseKey: e.target.value }))}
          value={licenseKey}
          placeholder="0-0000000000000-00000000-00000000-00000000-00000000"
          error={Boolean(licenseKeyError)}
          variant="outlined"
          helperText={licenseKeyError || `If you have already purchased ${appJson.name} Plus from our website, you should have received a license key via email to enter above.`}
        />
        <DialogContentText
          sx={{ mt: 1, textAlign: 'right' }}
        >
          <Button
            onClick={() => requestOpenInBrowser(`https://${appJson.hostname}/help/?utm_source=${utmSource}`)}
          >
            Lost your license key?
          </Button>
        </DialogContentText>

        <Typography sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
          If you&#39;ve purchased&nbsp;
          {appJson.name}
          &nbsp;from Mac App Store or Windows Store,
          <Button
            sx={{
              cursor: 'pointer',
              m: 0.4,
              p: 0,
              fontSize: '0.9rem',
            }}
            href="#text-buttons"
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              const contactUrl = 'https://webcatalog.io/contact';
              requestOpenInBrowser(contactUrl);
            }}
          >
            email us
          </Button>
          with your purchase receipt attached to receive a free license key.
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          m: 0,
          p: 1,
        }}
      >
        <Box style={{ flex: 1 }}>
          <Button
            onClick={() => requestOpenInBrowser(`https://${appJson.hostname}/pricing/?utm_source=${utmSource}`)}
          >
            Purchase a License...
          </Button>
          <Button
            onClick={() => requestOpenInBrowser(`https://${appJson.hostname}/pricing?utm_source=${utmSource}`)}
          >
            Learn More...
          </Button>
        </Box>
        <Button
          onClick={() => getCurrentWindow().close()}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => dispatch(register())}
        >
          Register
        </Button>
      </DialogActions>
    </Box>
  );
};

export default DialogLicenseRegistration;
