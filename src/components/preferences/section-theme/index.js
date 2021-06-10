/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import ListItemIcon from '@material-ui/core/ListItemIcon';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import themeColors from '../../../constants/theme-colors';

import {
  requestSetPreference,
} from '../../../senders';

const styles = (theme) => ({
  sliderContainer: {
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
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
});

const camelCaseToSentenceCase = (val) => {
  // convert camel case to sentence case
  const valTitleRaw = val.replace(/([A-Z])/g, ' $1');
  const valTitle = valTitleRaw.charAt(0).toUpperCase() + valTitleRaw.slice(1);
  return valTitle;
};

const SectionTheme = ({
  classes,
  darkReader,
  darkReaderBrightness,
  darkReaderContrast,
  darkReaderGrayscale,
  darkReaderSepia,
  themeSource,
  themeColor,
}) => (
  <>
    <List disablePadding dense>
      <ListItem>
        <ListItemText primary="Theme" />
        <Select
          value={themeSource}
          onChange={(e) => requestSetPreference('themeSource', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
        >
          <MenuItem dense value="system">System default</MenuItem>
          <MenuItem dense value="light">Light</MenuItem>
          <MenuItem dense value="dark">Dark</MenuItem>
        </Select>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Background Color" />
        <Select
          value={themeColor == null ? 'none' : themeColor}
          onChange={(e) => requestSetPreference('themeColor', e.target.value === 'none' ? null : e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
          renderValue={(value) => camelCaseToSentenceCase(value)}
        >
          <MenuItem dense value="none">None</MenuItem>
          <MenuItem dense value="auto">
            <ListItemIcon>
              <Avatar className={classes.avatar}>A</Avatar>
            </ListItemIcon>
            <ListItemText primary={`Matches with active ${getWorkspaceFriendlyName().toLowerCase()}'s color`} />
          </MenuItem>
          {Object.keys(themeColors).map((val) => (
            <MenuItem dense value={val} key={val}>
              <ListItemIcon>
                <Avatar className={classes.avatar} style={{ backgroundColor: themeColors[val][600] }}>{' '}</Avatar>
              </ListItemIcon>
              <ListItemText primary={camelCaseToSentenceCase(val)} />
            </MenuItem>
          ))}
        </Select>
      </ListItem>
      <Divider />
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

SectionTheme.defaultProps = {
  themeColor: null,
};

SectionTheme.propTypes = {
  classes: PropTypes.object.isRequired,
  darkReader: PropTypes.bool.isRequired,
  darkReaderBrightness: PropTypes.number.isRequired,
  darkReaderContrast: PropTypes.number.isRequired,
  darkReaderGrayscale: PropTypes.number.isRequired,
  darkReaderSepia: PropTypes.number.isRequired,
  themeSource: PropTypes.string.isRequired,
  themeColor: PropTypes.string,
};

const mapStateToProps = (state) => ({
  darkReader: state.preferences.darkReader,
  darkReaderBrightness: state.preferences.darkReaderBrightness,
  darkReaderContrast: state.preferences.darkReaderContrast,
  darkReaderGrayscale: state.preferences.darkReaderGrayscale,
  darkReaderSepia: state.preferences.darkReaderSepia,
  themeSource: state.preferences.themeSource,
  themeColor: state.preferences.themeColor,
});

export default connectComponent(
  SectionTheme,
  mapStateToProps,
  null,
  styles,
);
