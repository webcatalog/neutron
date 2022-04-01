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

import { useSelector } from 'react-redux';

import {
  requestSetPreference,
} from '../../../senders';

const SectionDarkReader = () => {
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
          secondary="Create unofficial dark theme for every web service & account."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={darkReader}
            onChange={(e) => {
              requestSetPreference('darkReader', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <>
        <Divider />
        <ListItem>
          <ListItemText
            sx={{
              pt: 2,
              px: 5,
            }}
          >
            <Grid container spacing={2}>
              <Grid
                sx={{
                  pt: 1.5,
                  width: 100,
                }}
                item
              >
                <Typography id="brightness-slider" variant="body2" gutterBottom={false} sx={{ m: 0.5 }}>
                  Brightness
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  size="small"
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                  value={darkReaderBrightness - 100}
                  disabled={!darkReader}
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
              <Grid
                sx={{
                  pt: 1.5,
                  width: 100,
                }}
                item
              >
                <Typography id="contrast-slider" variant="body2" gutterBottom={false} sx={{ m: 0.5 }}>
                  Contrast
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  size="small"
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                  value={darkReaderContrast - 100}
                  disabled={!darkReader}
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
              <Grid
                sx={{
                  pt: 1.5,
                  width: 100,
                }}
                item
              >
                <Typography id="sepia-slider" variant="body2" gutterBottom={false} sx={{ m: 0.5 }}>
                  Sepia
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  size="small"
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                  value={darkReaderSepia}
                  disabled={!darkReader}
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
              <Grid
                sx={{
                  pt: 1.5,
                  width: 100,
                }}
                item
              >
                <Typography id="grayscale-slider" variant="body2" gutterBottom={false} sx={{ m: 0.5 }}>
                  Grayscale
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  size="small"
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                  value={darkReaderGrayscale}
                  disabled={!darkReader}
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
    </List>
  );
};

export default SectionDarkReader;
