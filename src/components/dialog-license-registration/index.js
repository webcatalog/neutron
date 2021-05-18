/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';

import {
  updateForm,
  register,
} from '../../state/dialog-license-registration/actions';

import { requestOpenInBrowser } from '../../senders';

import getStaticGlobal from '../../helpers/get-static-global';
import getUtmSource from '../../helpers/get-utm-source';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  dialogContentText: {
    marginTop: theme.spacing(2),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  helpContent: {
    marginTop: theme.spacing(1),
    textAlign: 'right',
  },
});

const DialogLicenseRegistration = ({
  classes,
  licenseKey,
  licenseKeyError,
  onUpdateForm,
  onRegister,
}) => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <div className={classes.root}>
      <DialogContent>
        <DialogContentText className={classes.dialogContentText}>
          You are currently running the free version of&nbsp;
          {appJson.name}
          &nbsp;which does not include&nbsp;
          <span
            onClick={() => requestOpenInBrowser('https://webcatalog.app/pricing?utm_source=webcatalog_app')}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://webcatalog.app/pricing?utm_source=webcatalog_app');
            }}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            premium features
          </span>
          &nbsp;such as adding unlimited number of services & accounts,
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
          onChange={(e) => onUpdateForm({ licenseKey: e.target.value })}
          value={licenseKey}
          placeholder="0-0000000000000-00000000-00000000-00000000-00000000"
          error={Boolean(licenseKeyError)}
          variant="outlined"
          helperText={licenseKeyError || `If you have already purchased ${appJson.name} Plus from our website, you should have received a license key via email to enter above.`}
        />

        <DialogContentText className={classes.helpContent}>
          <Button
            onClick={() => requestOpenInBrowser(`https://${appJson.hostname}/help?utm_source=${utmSource}`)}
          >
            Lost your license key?
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => requestOpenInBrowser(`https://${appJson.hostname}/pricing?utm_source=${utmSource}`)}
          >
            Purchase a License...
          </Button>
          <Button
            onClick={() => requestOpenInBrowser(`https://${appJson.hostname}/pricing?utm_source=${utmSource}`)}
          >
            Learn More...
          </Button>
        </div>
        <Button
          onClick={() => window.remote.getCurrentWindow().close()}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onRegister}
        >
          Register
        </Button>
      </DialogActions>
    </div>
  );
};

DialogLicenseRegistration.defaultProps = {
  licenseKey: '',
  licenseKeyError: null,
};

DialogLicenseRegistration.propTypes = {
  classes: PropTypes.object.isRequired,
  licenseKey: PropTypes.string,
  licenseKeyError: PropTypes.string,
  onRegister: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    form: {
      licenseKey,
      licenseKeyError,
    },
  } = state.dialogLicenseRegistration;

  return {
    licenseKey,
    licenseKeyError,
  };
};

const actionCreators = {
  updateForm,
  register,
};

export default connectComponent(
  DialogLicenseRegistration,
  mapStateToProps,
  actionCreators,
  styles,
);
