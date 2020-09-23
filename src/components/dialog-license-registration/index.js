import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';

import connectComponent from '../../helpers/connect-component';

import {
  updateForm,
  register,
} from '../../state/dialog-license-registration/actions';

import { requestOpenInBrowser } from '../../senders';

const styles = (theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100vh',
    width: '100vw',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  dialogContentText: {
    marginTop: theme.spacing(1),
  },
  actions: {
    display: 'flex',
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const DialogLicenseRegistration = (props) => {
  const {
    classes,
    licenseKey,
    licenseKeyError,
    onUpdateForm,
    onRegister,
  } = props;

  return (
    <div className={classes.root}>
      <div className={classes.flexGrow}>
        <DialogContentText className={classes.dialogContentText}>
          You are currently running the free version of Singlebox which
          which only
          lets you add up to 5 workspaces and does not include&nbsp;
          <span
            onClick={() => requestOpenInBrowser('https://atomery.com/singlebox/pricing?utm_source=singlebox_app')}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://atomery.com/singlebox/pricing?utm_source=singlebox_app');
            }}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            premium features
          </span>
          &nbsp;such as blocking ads & trackers and more.
          To remove the limitations, please purchase the full version ($19.99) from our store.
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
          helperText={licenseKeyError || 'If you have already purchased Singlebox from our store, you should have received a license key via email to enter above.'}
        />
      </div>
      <div className={classes.actions}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.onfastspring.com/singleboxapp?utm_source=singlebox_app')}
          >
            Visit Store...
          </Button>
          <Button
            onClick={() => requestOpenInBrowser('https://atomery.com/singlebox/pricing?utm_source=singlebox_app')}
          >
            Learn More...
          </Button>
        </div>
        <div>
          <Button
            color="primary"
            variant="contained"
            disableElevation
            className={classes.button}
            onClick={onRegister}
          >
            Register
          </Button>
          <Button variant="contained" disableElevation className={classes.button} onClick={() => window.remote.getCurrentWindow().close()}>
            Cancel
          </Button>
        </div>
      </div>
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
