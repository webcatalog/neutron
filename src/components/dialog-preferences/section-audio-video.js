/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../helpers/connect-component';

import {
  requestSetPreference,
} from '../../senders';

const SectionAudioVideo = ({
  classes,
  defaultAudioInputDeviceLabel,
  defaultAudioOutputDeviceLabel,
  defaultVideoInputDeviceLabel,
}) => {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    window.navigator.mediaDevices.enumerateDevices()
      .then((_devices) => {
        setDevices(_devices);
      })
      // eslint-disable-next-line no-console
      .catch(console.log);
  }, [setDevices]);

  return (
    <Paper elevation={0} className={classes.paper}>
      <List disablePadding dense>
        <ListItem>
          <ListItemText
            primary="Preferred audio input device"
          />
          <Select
            value={(() => {
              if (defaultAudioInputDeviceLabel) return defaultAudioInputDeviceLabel;
              if (devices.length > 0) {
                const audioInputDevice = devices.find((device) => device.kind === 'audioinput');
                if (audioInputDevice) return audioInputDevice.label;
              }
              return '';
            })()}
            onChange={(e) => requestSetPreference('defaultAudioInputDeviceLabel', e.target.value)}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classes.selectRoot}
          >
            {devices.map((device) => device.kind === 'audioinput' && (
              <MenuItem
                key={`${device.kind}:${device.deviceId}`}
                value={device.label}
                dense
              >
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Preferred audio output device"
          />
          <Select
            value={(() => {
              if (defaultAudioOutputDeviceLabel) return defaultAudioOutputDeviceLabel;
              if (devices.length > 0) {
                const audioOutputDevice = devices.find((device) => device.kind === 'audiooutput');
                if (audioOutputDevice) return audioOutputDevice.label;
              }
              return '';
            })()}
            onChange={(e) => requestSetPreference('defaultAudioOutputDeviceLabel', e.target.value)}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classes.selectRoot}
          >
            {devices.map((device) => device.kind === 'audiooutput' && (
              <MenuItem
                key={`${device.kind}:${device.deviceId}`}
                value={device.label}
                dense
              >
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary="Preferred video input device"
          />
          <Select
            value={(() => {
              if (defaultVideoInputDeviceLabel) return defaultVideoInputDeviceLabel;
              if (devices.length > 0) {
                const videoInputDevice = devices.find((device) => device.kind === 'videoinput');
                if (videoInputDevice) return videoInputDevice.label;
              }
              return '';
            })()}
            onChange={(e) => requestSetPreference('defaultVideoInputDeviceLabel', e.target.value)}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classes.selectRoot}
          >
            {devices.map((device) => device.kind === 'videoinput' && (
              <MenuItem
                key={`${device.kind}:${device.deviceId}`}
                value={device.label}
                dense
              >
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </ListItem>
      </List>
    </Paper>
  );
};

SectionAudioVideo.defaultProps = {
  defaultAudioInputDeviceLabel: null,
  defaultAudioOutputDeviceLabel: null,
  defaultVideoInputDeviceLabel: null,
};

SectionAudioVideo.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultAudioInputDeviceLabel: PropTypes.string,
  defaultAudioOutputDeviceLabel: PropTypes.string,
  defaultVideoInputDeviceLabel: PropTypes.string,
};

const mapStateToProps = (state) => ({
  defaultAudioInputDeviceLabel: state.preferences.defaultAudioInputDeviceLabel,
  defaultAudioOutputDeviceLabel: state.preferences.defaultAudioOutputDeviceLabel,
  defaultVideoInputDeviceLabel: state.preferences.defaultVideoInputDeviceLabel,
});

export default connectComponent(
  SectionAudioVideo,
  mapStateToProps,
);
