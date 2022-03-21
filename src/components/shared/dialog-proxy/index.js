/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import getUtmSource from '../../../helpers/get-utm-source';

import {
  close,
  updateForm,
  save,
} from '../../../state/dialog-proxy/actions';

import { requestOpenInBrowser } from '../../../senders';

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  dialogContentText: {
    marginTop: theme.spacing(2),
  },
  link: {
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  button: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
  radioLabel: theme.typography.body2,
  addressContainer: {
    display: 'flex',
  },
  addressTextField: {
    flex: 1,
    paddingRight: theme.spacing(1),
  },
}));

const DialogProxy = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogProxy.open);
  const proxyBypassRules = useSelector((state) => state.dialogProxy.form.proxyBypassRules);
  const proxyPacScript = useSelector((state) => state.dialogProxy.form.proxyPacScript);
  const proxyPacScriptError = useSelector((state) => state.dialogProxy.form.proxyPacScriptError);
  const proxyAddress = useSelector((state) => state.dialogProxy.form.proxyAddress);
  const proxyAddressError = useSelector((state) => state.dialogProxy.form.proxyAddressError);
  const proxyPort = useSelector((state) => state.dialogProxy.form.proxyPort);
  const proxyPortError = useSelector((state) => state.dialogProxy.form.proxyPortError);
  const proxyProtocol = useSelector((state) => state.dialogProxy.form.proxyProtocol);
  const proxyProtocolError = useSelector((state) => state.dialogProxy.form.proxyProtocolError);
  const proxyMode = useSelector((state) => state.dialogProxy.form.proxyMode);

  const utmSource = getUtmSource();

  const bypassRulesTextField = (
    <TextField
      margin="dense"
      fullWidth
      label="Bypass rules"
      variant="outlined"
      value={proxyBypassRules}
      onChange={(e) => dispatch(updateForm({ proxyBypassRules: e.target.value }))}
      helperText={(
        <>
          <span>Rules indicating which URLs should bypass the proxy settings. </span>
          <span>Set to </span>
          <strong>&lt;local&gt;</strong>
          <span> to bypass proxy server for local addresses. </span>
          <span
            role="link"
            tabIndex={0}
            className={classes.link}
            onClick={() => requestOpenInBrowser(`https://docs.webcatalog.io/article/40-how-to-define-proxy-bypass-rules?utm_source=${utmSource}`)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser(`https://docs.webcatalog.io/article/40-how-to-define-proxy-bypass-rules?utm_source=${utmSource}`);
            }}
          >
            Learn more
          </span>
        </>
      )}
    />
  );

  return (
    <Dialog
      onClose={() => dispatch(close())}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <Typography variant="body2" gutterBottom>
          The proxy configurations are only applied when you
          access and visit your web services & accounts
          , not when you use other parts of the app (e.g checking for updates,
          accessing service catalog, etc).
        </Typography>
        <Divider />

        <List disablePadding dense>
          <ListItem>
            <div style={{ width: '100%' }}>
              <ListItemText primary="" />
              <FormControlLabel
                classes={{ label: classes.radioLabel }}
                control={<Radio color="primary" size="small" />}
                label="Use proxy server"
                labelPlacement="end"
                checked={proxyMode === 'fixed_servers'}
                value="fixed_servers"
                onChange={(e) => dispatch(updateForm({ proxyMode: e.target.value }))}
              />
              {proxyMode === 'fixed_servers' && (
                <>
                  <FormControl variant="outlined" margin="dense" fullWidth error={Boolean(proxyProtocolError)}>
                    <InputLabel id="demo-simple-select-error-label">Protocol</InputLabel>
                    <Select
                      value={proxyProtocol}
                      onChange={(e) => dispatch(updateForm({ proxyProtocol: e.target.value }))}
                    >
                      {['socks5', 'socks4', 'https', 'http', 'ftp'].map((val) => (
                        <MenuItem key={val} value={val}>{val}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{Boolean(proxyProtocolError)}</FormHelperText>
                  </FormControl>
                  <div className={classes.addressContainer}>
                    <TextField
                      margin="dense"
                      label="Address"
                      variant="outlined"
                      value={proxyAddress}
                      onChange={(e) => dispatch(updateForm({ proxyAddress: e.target.value }))}
                      error={Boolean(proxyAddressError)}
                      className={classes.addressTextField}
                    />
                    <TextField
                      margin="dense"
                      label="Port"
                      variant="outlined"
                      value={proxyPort}
                      onChange={(e) => dispatch(updateForm({ proxyPort: e.target.value }))}
                      error={Boolean(proxyPortError)}
                    />
                  </div>
                  {bypassRulesTextField}
                </>
              )}
            </div>
          </ListItem>
          <ListItem>
            <div style={{ width: '100%' }}>
              <FormControlLabel
                classes={{ label: classes.radioLabel }}
                control={<Radio color="primary" size="small" />}
                label="Use PAC script (automatic proxy configuration script)"
                labelPlacement="end"
                checked={proxyMode === 'pac_script'}
                value="pac_script"
                onChange={(e) => dispatch(updateForm({ proxyMode: e.target.value }))}
              />
              {proxyMode === 'pac_script' && (
                <>
                  <TextField
                    margin="dense"
                    fullWidth
                    label="Script URL"
                    variant="outlined"
                    disabled={proxyMode !== 'pac_script'}
                    value={proxyPacScript}
                    onChange={(e) => dispatch(updateForm({ proxyPacScript: e.target.value }))}
                    error={Boolean(proxyPacScriptError)}
                    helperText={proxyPacScriptError || (
                      <>
                        <span>Example: http://example.com/proxy.pac. </span>
                        <span
                          role="link"
                          tabIndex={0}
                          className={classes.link}
                          onClick={() => requestOpenInBrowser('https://en.wikipedia.org/wiki/Proxy_auto-config')}
                          onKeyDown={(e) => {
                            if (e.key !== 'Enter') return;
                            requestOpenInBrowser('https://en.wikipedia.org/wiki/Proxy_auto-config');
                          }}
                        >
                          Learn more
                        </span>
                      </>
                    )}
                  />
                  {bypassRulesTextField}
                </>
              )}
            </div>
          </ListItem>
          <ListItem>
            <div style={{ width: '100%' }}>
              <FormControlLabel
                classes={{ label: classes.radioLabel }}
                control={<Radio color="primary" size="small" />}
                label="Use system proxy configurations"
                labelPlacement="end"
                checked={proxyMode === 'system'}
                value="system"
                onChange={(e) => dispatch(updateForm({ proxyMode: e.target.value }))}
              />
            </div>
          </ListItem>
          <ListItem>
            <div style={{ width: '100%' }}>
              <ListItemText primary="" />
              <FormControlLabel
                classes={{ label: classes.radioLabel }}
                control={<Radio color="primary" size="small" />}
                label="Do not use proxy (default)"
                labelPlacement="end"
                checked={proxyMode === 'direct'}
                value="direct"
                onChange={(e) => dispatch(updateForm({ proxyMode: e.target.value }))}
              />
            </div>
          </ListItem>
          {window.mode === 'workspace-preferences' && (
            <ListItem>
              <div style={{ width: '100%' }}>
                <ListItemText primary="" />
                <FormControlLabel
                  classes={{ label: classes.radioLabel }}
                  control={<Radio color="primary" size="small" />}
                  label="Use global preference"
                  labelPlacement="end"
                  checked={proxyMode == null}
                  value="direct"
                  onChange={() => dispatch(updateForm({ proxyMode: null }))}
                />
              </div>
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disableElevation onClick={() => dispatch(close())}>
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          disableElevation
          onClick={() => dispatch(save())}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogProxy;
