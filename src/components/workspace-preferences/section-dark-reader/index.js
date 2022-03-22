/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import getStaticGlobal from '../../../helpers/get-static-global';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const useStyles = makeStyles((theme) => ({
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
}));

const SectionDarkReader = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const darkReader = useSelector((state) => state.preferences.darkReader);
  const formDarkReader = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.darkReader,
  );
  const formDarkReaderBrightness = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.darkReaderBrightness,
  );
  const formDarkReaderContrast = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.darkReaderContrast,
  );
  const formDarkReaderGrayscale = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.darkReaderGrayscale,
  );
  const formDarkReaderSepia = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferences.darkReaderSepia,
  );

  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary="Dark Reader"
          secondary={getStaticGlobal('darkReaderExtensionDetected')
            ? 'The built-in Dark Reader feature has been taken over by the external Dark Reader extension.'
            : 'Create unofficial dark theme for every web service & account.'}
        />
        <Select
          value={(() => {
            if (getStaticGlobal('darkReaderExtensionDetected')) {
              return false;
            }
            return formDarkReader != null ? formDarkReader : 'global';
          })()}
          disabled={getStaticGlobal('darkReaderExtensionDetected')}
          onChange={(e) => dispatch(updateForm({
            preferences: {
              darkReader: e.target.value !== 'global' ? e.target.value : null,
            },
          }))}
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
      {formDarkReader && !getStaticGlobal('darkReaderExtensionDetected') && <Divider />}
      {formDarkReader && !getStaticGlobal('darkReaderExtensionDetected') && (
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
                    dispatch(updateForm({ preferences: { darkReaderBrightness: value + 100 } }));
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
                    dispatch(updateForm({ preferences: { darkReaderContrast: value + 100 } }));
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
                    dispatch(updateForm({ preference: { darkReaderSepia: value } }));
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
                    dispatch(updateForm({ preferences: { darkReaderGrayscale: value } }));
                  }}
                />
              </Grid>
            </Grid>
          </ListItemText>
        </ListItem>
      )}
    </List>
  );
};

export default SectionDarkReader;
