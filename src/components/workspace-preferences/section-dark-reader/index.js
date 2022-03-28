/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { useDispatch, useSelector } from 'react-redux';

import getStaticGlobal from '../../../helpers/get-static-global';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

const SectionDarkReader = () => {
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
          sx={{
            borderRadius: 0.5,
            fontSize: '0.84375rem',
            '& .MuiSelect-select': {
              py: 1,
              pr: 3.25,
              pl: 1.5,
            },
          }}
        >
          <MenuItem dense value="global">{`Use global preference (${darkReader ? 'Yes' : 'No'})`}</MenuItem>
          <MenuItem dense value>Yes</MenuItem>
          <MenuItem dense value={false}>No</MenuItem>
        </Select>
      </ListItem>
      {formDarkReader && !getStaticGlobal('darkReaderExtensionDetected') && <Divider />}
      {formDarkReader && !getStaticGlobal('darkReaderExtensionDetected') && (
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
                <Typography id="brightness-slider" variant="body2" gutterBottom={false}>
                  Brightness
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
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
              <Grid
                sx={{
                  pt: 1.5,
                  width: 100,
                }}
                item
              >
                <Typography id="contrast-slider" variant="body2" gutterBottom={false}>
                  Contrast
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
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
              <Grid
                sx={{
                  pt: 1.5,
                  width: 100,
                }}
                item
              >
                <Typography id="sepia-slider" variant="body2" gutterBottom={false}>
                  Sepia
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
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
              <Grid
                sx={{
                  pt: 1.5,
                  width: 100,
                }}
                item
              >
                <Typography id="grayscale-slider" variant="body2" gutterBottom={false}>
                  Grayscale
                </Typography>
              </Grid>
              <Grid item xs>
                <Slider
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
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
