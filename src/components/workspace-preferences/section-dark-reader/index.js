/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import connectComponent from '../../../helpers/connect-component';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

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
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const SectionDarkReader = ({
  classes,
  darkReader,
  onUpdateForm,

  formDarkReader,
  formDarkReaderBrightness,
  formDarkReaderContrast,
  formDarkReaderGrayscale,
  formDarkReaderSepia,
}) => (
  <List disablePadding dense>
    <ListItem>
      <ListItemText
        primary="Dark Reader"
        secondary="Create unofficial dark theme for every service & account."
      />
      <Select
        value={formDarkReader != null ? formDarkReader : 'global'}
        onChange={(e) => onUpdateForm({
          preferences: {
            darkReader: e.target.value !== 'global' ? e.target.value : null,
          },
        })}
        variant="filled"
        disableUnderline
        margin="dense"
        classes={{
          root: classes.select,
        }}
        className={classes.selectRoot}
      >
        <MenuItem dense value="global">{`Use global preference (${darkReader ? 'Yes' : 'No'})`}</MenuItem>
        <MenuItem dense value>Yes</MenuItem>
        <MenuItem dense value={false}>No</MenuItem>
      </Select>
    </ListItem>
    {formDarkReader && <Divider />}
    {formDarkReader && (
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
                value={formDarkReaderBrightness - 100}
                aria-labelledby="brightness-slider"
                valueLabelDisplay="auto"
                step={5}
                valueLabelFormat={(val) => {
                  if (val > 0) return `+${val}`;
                  return val;
                }}
                marks={[
                  {
                    value: formDarkReaderBrightness - 100,
                    label: `${formDarkReaderBrightness > 100 ? '+' : ''}${formDarkReaderBrightness - 100}`,
                  },
                ]}
                min={-50}
                max={50}
                onChange={(e, value) => {
                  onUpdateForm({ preferences: { darkReaderBrightness: value + 100 } });
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
                value={formDarkReaderContrast - 100}
                aria-labelledby="contrast-slider"
                valueLabelDisplay="auto"
                step={5}
                valueLabelFormat={(val) => {
                  if (val > 0) return `+${val}`;
                  return val;
                }}
                marks={[
                  {
                    value: formDarkReaderContrast - 100,
                    label: `${formDarkReaderContrast > 100 ? '+' : ''}${formDarkReaderContrast - 100}`,
                  },
                ]}
                min={-50}
                max={50}
                onChange={(e, value) => {
                  onUpdateForm({ preferences: { darkReaderContrast: value + 100 } });
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
                value={formDarkReaderSepia}
                aria-labelledby="sepia-slider"
                valueLabelDisplay="auto"
                step={5}
                marks={[
                  {
                    value: formDarkReaderSepia,
                    label: `${formDarkReaderSepia}`,
                  },
                ]}
                min={0}
                max={100}
                onChange={(e, value) => {
                  onUpdateForm({ preference: { darkReaderSepia: value } });
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
                value={formDarkReaderGrayscale}
                aria-labelledby="grayscale-slider"
                valueLabelDisplay="auto"
                step={5}
                marks={[
                  {
                    value: formDarkReaderGrayscale,
                    label: `${formDarkReaderGrayscale}`,
                  },
                ]}
                min={0}
                max={100}
                onChange={(e, value) => {
                  onUpdateForm({ preferences: { darkReaderGrayscale: value } });
                }}
              />
            </Grid>
          </Grid>
        </ListItemText>
      </ListItem>
    )}
  </List>
);

SectionDarkReader.defaultProps = {
  formDarkReader: null,
  formDarkReaderBrightness: 100,
  formDarkReaderContrast: 100,
  formDarkReaderGrayscale: 0,
  formDarkReaderSepia: 0,
};

SectionDarkReader.propTypes = {
  classes: PropTypes.object.isRequired,
  darkReader: PropTypes.bool.isRequired,
  onUpdateForm: PropTypes.func.isRequired,

  formDarkReader: PropTypes.bool,
  formDarkReaderBrightness: PropTypes.number,
  formDarkReaderContrast: PropTypes.number,
  formDarkReaderGrayscale: PropTypes.number,
  formDarkReaderSepia: PropTypes.number,
};

const mapStateToProps = (state) => ({
  darkReader: state.preferences.darkReader,
  formDarkReader: state.dialogWorkspacePreferences.form.preferences.darkReader,
  formDarkReaderBrightness: state.dialogWorkspacePreferences.form.preferences.darkReaderBrightness,
  formDarkReaderContrast: state.dialogWorkspacePreferences.form.preferences.darkReaderContrast,
  formDarkReaderGrayscale: state.dialogWorkspacePreferences.form.preferences.darkReaderGrayscale,
  formDarkReaderSepia: state.dialogWorkspacePreferences.form.preferences.darkReaderSepia,
});

const actionCreators = {
  updateForm,
};

export default connectComponent(
  SectionDarkReader,
  mapStateToProps,
  actionCreators,
  styles,
);
