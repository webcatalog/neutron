/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect, useCallback } from 'react';
import { uniqBy } from 'lodash';
import { app } from '@electron/remote';

import Button from '@mui/material/Button';

import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

import { useSelector } from 'react-redux';

import {
  getExtensionFromProfileAsync,
  getExtensionSourcesAsync,
} from '../../../invokers';

import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
  requestOpenInBrowser,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
  },
  button: {
    float: 'left',
    marginRight: theme.spacing(1),
  },
  buttonRight: {
    marginRight: theme.spacing(1),
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
  actions: {
    display: 'flex',
    width: '100%',
  },
  actionsLeft: {
    flex: 1,
  },
}));

const Extensions = () => {
  const classes = useStyles();
  // extension action buttons are only visible on sidebar or navigation bar
  const extensionButtonsVisible = useSelector(
    (state) => state.preferences.sidebar || state.preferences.navigationBar,
  );
  const extensionEnabledExtesionIds = useSelector(
    (state) => state.preferences.extensionEnabledExtesionIds,
  );
  const extensionSourceBrowserId = useSelector(
    (state) => state.preferences.extensionSourceBrowserId,
  );
  const extensionSourceProfileDirName = useSelector(
    (state) => state.preferences.extensionSourceProfileDirName,
  );

  const [extensions, setExtensions] = useState([]);
  const [sources, setSources] = useState([]);

  const refresh = useCallback(() => {
    getExtensionFromProfileAsync(extensionSourceBrowserId, extensionSourceProfileDirName)
      .then((_extensions) => {
        setExtensions(uniqBy(_extensions, 'id'));
      // eslint-disable-next-line no-console
      }).catch(console.log);

    getExtensionSourcesAsync()
      .then((_sources) => {
        setSources(_sources);
      // eslint-disable-next-line no-console
      }).catch(console.log);
  }, [extensionSourceBrowserId, extensionSourceProfileDirName, setExtensions, setSources]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const currentSource = sources
    .find((source) => source.browserId === extensionSourceBrowserId);

  return (
    <ListItem>
      <div className={classes.container}>
        {sources.length > 0 ? (
          <>
            <Typography variant="body2" component="p" gutterBottom>
              Extensions are installed and updated through
              Google Chrome, Microsoft Edge, Vivaldi, Brave or Chromium.
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
                    <MenuItem key={source.browserId} value={source.browserId}>
                      {source.browserName}
                    </MenuItem>
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
                      <MenuItem key={profile.profileDirName} value={profile.profileDirName}>
                        {profile.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>

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
                    enqueueRequestRestartSnackbar();
                  }}
                >
                  Disable All
                </Button>
              </div>
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
                    <Button
                      variant="text"
                      className={classes.buttonRight}
                      onClick={() => requestOpenInBrowser(`https://docs.google.com/forms/d/e/1FAIpQLSfF4IhgsyYDbiGVx0sz0JKLd9Rs0g71lUqTpw8Jv_nixpQqiw/viewform?entry.1002721177=${encodeURIComponent(ext.name)}&entry.1851347571=${encodeURIComponent(app.getVersion())}`)}
                    >
                      Does it Work?
                    </Button>
                    <Switch
                      checked={extensionEnabledExtesionIds[ext.id]}
                      onChange={(e) => {
                        const { checked } = e.target;
                        const newExtensionIds = { ...extensionEnabledExtesionIds };
                        if (checked) {
                          newExtensionIds[ext.id] = true;
                          // if sidebar and navigation bar are not visible
                          // it means the extension action buttons are not visible
                          // so we force navigation bar to show up
                          // so users can find the buttons
                          if (!extensionButtonsVisible) {
                            requestSetPreference('navigationBar', true);
                          }
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
          </>
        ) : (
          <>
            <Typography variant="body2" component="p" gutterBottom>
              Extensions are installed and updated through
              Google Chrome, Microsoft Edge, Vivaldi, Brave or Chromium.
            </Typography>

            <Typography variant="body1" component="p">
              To continue, please install Google Chrome, Microsoft Edge, Vivaldi, Brave or Chromium.
            </Typography>
          </>
        )}
      </div>
    </ListItem>
  );
};

export default Extensions;
