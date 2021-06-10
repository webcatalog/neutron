/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';

import {
  requestSetPreference,
} from '../../../senders';

const styles = (theme) => ({
  sliderContainer: {
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
  sliderTitleContainer: {
    paddingTop: `${theme.spacing(1.5)}px !important`,
    width: 100,
  },
  sliderMarkLabel: {
    fontSize: '0.75rem',
  },
});

const SectionDarkReader = ({
  classes,
  darkReader,
  darkReaderBrightness,
  darkReaderContrast,
  darkReaderGrayscale,
  darkReaderSepia,
}) => (
  <>
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Dark Reader"
          secondary="Create unofficial dark theme for every service & account."
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
            <Grid classes={{ item: classes.sliderTitleContainer }} item>
              <Typography id="contrast-slider" variant="body2" gutterBottom={false}>
                Contrast
              </Typography>
            </Grid>
            <Grid item xs>
              <Slider
                classes={{ markLabel: classes.sliderMarkLabel }}
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
            <Grid classes={{ item: classes.sliderTitleContainer }} item>
              <Typography id="sepia-slider" variant="body2" gutterBottom={false}>
                Sepia
              </Typography>
            </Grid>
            <Grid item xs>
              <Slider
                classes={{ markLabel: classes.sliderMarkLabel }}
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
            <Grid classes={{ item: classes.sliderTitleContainer }} item>
              <Typography id="grayscale-slider" variant="body2" gutterBottom={false}>
                Grayscale
              </Typography>
            </Grid>
            <Grid item xs>
              <Slider
                classes={{ markLabel: classes.sliderMarkLabel }}
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
    </List>
  </>
);

SectionDarkReader.propTypes = {
  classes: PropTypes.object.isRequired,
  darkReader: PropTypes.bool.isRequired,
  darkReaderBrightness: PropTypes.number.isRequired,
  darkReaderContrast: PropTypes.number.isRequired,
  darkReaderGrayscale: PropTypes.number.isRequired,
  darkReaderSepia: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  darkReader: state.preferences.darkReader,
  darkReaderBrightness: state.preferences.darkReaderBrightness,
  darkReaderContrast: state.preferences.darkReaderContrast,
  darkReaderGrayscale: state.preferences.darkReaderGrayscale,
  darkReaderSepia: state.preferences.darkReaderSepia,
});

export default connectComponent(
  SectionDarkReader,
  mapStateToProps,
  null,
  styles,
);
