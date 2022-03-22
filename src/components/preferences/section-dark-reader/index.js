/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Slider from '@mui/material/Slider';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import makeStyles from '@mui/styles/makeStyles';

import { useSelector } from 'react-redux';

import getStaticGlobal from '../../../helpers/get-static-global';

import {
  requestSetPreference,
} from '../../../senders';

const useStyles = makeStyles((theme) => ({
  sliderContainer: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
  sliderTitleContainer: {
    paddingTop: `${theme.spacing(1.5)} !important`,
    width: 100,
  },
  sliderMarkLabel: {
    fontSize: '0.75rem',
  },
}));

const SectionDarkReader = () => {
  const classes = useStyles();

  const darkReader = useSelector((state) => state.preferences.darkReader);
  const darkReaderBrightness = useSelector((state) => state.preferences.darkReaderBrightness);
  const darkReaderContrast = useSelector((state) => state.preferences.darkReaderContrast);
  const darkReaderGrayscale = useSelector((state) => state.preferences.darkReaderGrayscale);
  const darkReaderSepia = useSelector((state) => state.preferences.darkReaderSepia);

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Dark Reader"
          secondary={getStaticGlobal('darkReaderExtensionDetected')
            ? 'The built-in Dark Reader feature has been taken over by the external Dark Reader extension.'
            : 'Create unofficial dark theme for every web service & account.'}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={getStaticGlobal('darkReaderExtensionDetected') ? false : darkReader}
            disabled={getStaticGlobal('darkReaderExtensionDetected')}
            onChange={(e) => {
              requestSetPreference('darkReader', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {!getStaticGlobal('darkReaderExtensionDetected') && (
      <>
        <Divider />
        <ListItem>
          <ListItemText className={classes.sliderContainer}>
            <Grid container spacing={2}>
              <Grid classes={{ item: classes.sliderTitleContainer }} item>
                <Typography id="brightness-slider" variant="body2" gutterBottom={false}>
                  Brightness
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  classes={{ markLabel: classes.sliderMarkLabel }}
                  value={darkReaderBrightness - 100}
                  disabled={getStaticGlobal('darkReaderExtensionDetected') || !darkReader}
                  aria-labelledby="brightness-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  valueLabelFormat={(val) => {
                    if (val > 0) return `+${val}`;
                    return val;
                  }}
                  marks={[
                    {
                      value: darkReaderBrightness - 100,
                      label: `${darkReaderBrightness > 100 ? '+' : ''}${darkReaderBrightness - 100}`,
                    },
                  ]}
                  min={-50}
                  max={50}
                  onChange={(e, value) => {
                    requestSetPreference('darkReaderBrightness', value + 100);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid classes={{ item: classes.sliderTitleContainer }} item>
                <Typography id="contrast-slider" variant="body2" gutterBottom={false}>
                  Contrast
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  classes={{ markLabel: classes.sliderMarkLabel }}
                  value={darkReaderContrast - 100}
                  disabled={getStaticGlobal('darkReaderExtensionDetected') || !darkReader}
                  aria-labelledby="contrast-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  valueLabelFormat={(val) => {
                    if (val > 0) return `+${val}`;
                    return val;
                  }}
                  marks={[
                    {
                      value: darkReaderContrast - 100,
                      label: `${darkReaderContrast > 100 ? '+' : ''}${darkReaderContrast - 100}`,
                    },
                  ]}
                  min={-50}
                  max={50}
                  onChange={(e, value) => {
                    requestSetPreference('darkReaderContrast', value + 100);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid classes={{ item: classes.sliderTitleContainer }} item>
                <Typography id="sepia-slider" variant="body2" gutterBottom={false}>
                  Sepia
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  classes={{ markLabel: classes.sliderMarkLabel }}
                  value={darkReaderSepia}
                  disabled={getStaticGlobal('darkReaderExtensionDetected') || !darkReader}
                  aria-labelledby="sepia-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    {
                      value: darkReaderSepia,
                      label: `${darkReaderSepia}`,
                    },
                  ]}
                  min={0}
                  max={100}
                  onChange={(e, value) => {
                    requestSetPreference('darkReaderSepia', value);
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid classes={{ item: classes.sliderTitleContainer }} item>
                <Typography id="grayscale-slider" variant="body2" gutterBottom={false}>
                  Grayscale
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  classes={{ markLabel: classes.sliderMarkLabel }}
                  value={darkReaderGrayscale}
                  disabled={getStaticGlobal('darkReaderExtensionDetected') || !darkReader}
                  aria-labelledby="grayscale-slider"
                  valueLabelDisplay="auto"
                  step={5}
                  marks={[
                    {
                      value: darkReaderGrayscale,
                      label: `${darkReaderGrayscale}`,
                    },
                  ]}
                  min={0}
                  max={100}
                  onChange={(e, value) => {
                    requestSetPreference('darkReaderGrayscale', value);
                  }}
                />
              </Grid>
            </Grid>
          </ListItemText>
        </ListItem>
      </>
      )}
    </List>
  );
};

export default SectionDarkReader;
