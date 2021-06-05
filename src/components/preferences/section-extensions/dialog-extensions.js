/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Switch from '@material-ui/core/Switch';
import Avatar from '@material-ui/core/Avatar';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';

import connectComponent from '../../../helpers/connect-component';

import { close } from '../../../state/dialog-extensions/actions';

import {
  getExtensionFromProfileAsync,
  getExtensionSourcesAsync,
} from '../../../invokers';

import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../../senders';

const styles = (theme) => ({
  button: {
    float: 'left',
    marginRight: theme.spacing(1),
  },
  buttonRight: {
    float: 'right',
    marginLeft: theme.spacing(1),
  },
  formRow: {
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  text: {
    lineHeight: '56px',
  },
  alert: {
    marginBottom: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    width: '100%',
  },
  actionsLeft: {
    flex: 1,
  },
});

const Extensions = ({
  classes,
  onClose,
  open,
  extensionSourceBrowserId,
  extensionSourceProfileDirName,
  extensionEnabledExtesionIds,
}) => {
  const [extensions, setExtensions] = useState([]);
  const [sources, setSources] = useState([]);

  const refresh = useMemo(() => () => {
    getExtensionFromProfileAsync(extensionSourceBrowserId, extensionSourceProfileDirName)
      .then((_extensions) => {
        setExtensions(_extensions);
      // eslint-disable-next-line no-console
      }).catch(console.log);

    getExtensionSourcesAsync()
      .then((_sources) => {
        setSources(_sources);
      // eslint-disable-next-line no-console
      }).catch(console.log);
  }, [extensionSourceBrowserId, extensionSourceProfileDirName, setExtensions, setSources]);

  useEffect(() => {
    if (open) {
      refresh();
    }
  }, [open, refresh]);

  const currentSource = sources
    .find((source) => source.browserId === extensionSourceBrowserId);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      {sources.length > 0 ? (
        <DialogContent>
          <Alert severity="warning" className={classes.alert}>
            Extension support is unstable. Use at your own risk.
          </Alert>

          <Typography variant="body2" component="p" gutterBottom>
            Extensions are installed and updated through Google Chrome or Microsoft Edge.
          </Typography>
          <div className={classes.formRow}>
            <Typography variant="body1" component="div" className={classes.text}>
              Load extensions from
            </Typography>
            <FormControl variant="outlined" margin="dense" className={classes.formControl}>
              <InputLabel id="browser-label">Browser</InputLabel>
              <Select
                labelId="browser-label"
                id="browser"
                value={extensionSourceBrowserId}
                onChange={(e) => {
                  const newSource = sources.find((source) => source.browserId === e.target.value);
                  if (!newSource) return;
                  requestSetPreference('extensionSourceBrowserId', newSource.browserId);
                  requestSetPreference('extensionSourceProfileDirName', newSource.profiles[0].profileDirName);
                }}
                label="Browser"
              >
                {sources.map((source) => (
                  <MenuItem value={source.browserId}>{source.browserName}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" margin="dense" className={classes.formControl}>
              <InputLabel id="profile-label">Profile</InputLabel>
              <Select
                labelId="profile-label"
                id="profile"
                value={extensionSourceProfileDirName}
                onChange={(e) => requestSetPreference('extensionSourceProfileDirName', e.target.value)}
                label="Profile"
              >
                {(currentSource ? currentSource.profiles : [])
                  .map((profile) => (
                    <MenuItem value={profile.profileDirName}>{profile.name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>

          <List dense>
            {extensions.map((ext) => (
              <ListItem key={ext.id}>
                <ListItemAvatar>
                  <Avatar
                    alt={ext.name}
                    src={`file://${ext.icon}`}
                    variant="square"
                  />
                </ListItemAvatar>
                <ListItemText primary={ext.name} secondary={`ID: ${ext.id}`} />
                <ListItemSecondaryAction>
                  <Switch
                    checked={extensionEnabledExtesionIds[ext.id]}
                    onChange={(e) => {
                      const { checked } = e.target;
                      const newExtensionIds = { ...extensionEnabledExtesionIds };
                      if (checked) {
                        newExtensionIds[ext.id] = true;
                      } else {
                        delete newExtensionIds[ext.id];
                      }
                      requestSetPreference('extensionEnabledExtesionIds', newExtensionIds);
                      enqueueRequestRestartSnackbar();
                    }}
                    color="primary"
                    inputProps={{ 'aria-label': ext.name }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      ) : (
        <DialogContent>
          <Typography variant="body2" component="p" gutterBottom>
            Extensions are installed and updated through Google Chrome or Microsoft Edge.
          </Typography>

          <Typography variant="body1" component="p">
            Please install Google Chrome or Microsoft Edge to continue.
          </Typography>
        </DialogContent>
      )}
      <DialogActions>
        <div className={classes.actions}>
          <div className={classes.actionsLeft}>
            <Button variant="contained" disableElevation className={classes.button} onClick={() => refresh()}>
              Refresh
            </Button>
            <Button
              variant="contained"
              disableElevation
              className={classes.button}
              onClick={() => {
                requestSetPreference('extensionEnabledExtesionIds', {});
              }}
            >
              Disable All
            </Button>
          </div>
          <div className={classes.actionsRight}>
            <Button variant="contained" disableElevation className={classes.buttonRight} onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
};

Extensions.defaultProps = {
  open: false,
  extensionEnabledExtesionIds: {},
};

Extensions.propTypes = {
  classes: PropTypes.object.isRequired,
  extensionEnabledExtesionIds: PropTypes.object,
  extensionSourceBrowserId: PropTypes.string.isRequired,
  extensionSourceProfileDirName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  open: state.dialogExtensions.open,
  extensionSourceBrowserId: state.preferences.extensionSourceBrowserId,
  extensionSourceProfileDirName: state.preferences.extensionSourceProfileDirName,
  extensionEnabledExtesionIds: state.preferences.extensionEnabledExtesionIds,
});

const actionCreators = {
  close,
};

export default connectComponent(
  Extensions,
  mapStateToProps,
  actionCreators,
  styles,
);
