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

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';

import {
  enqueueRequestRestartSnackbar,
  requestRealignActiveWorkspace,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogCustomizeFonts } from '../../../state/dialog-customize-fonts/actions';

import DialogCustomizeFonts from './dialog-customize-fonts';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
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
});

const SectionAppearance = ({
  attachToMenubar,
  classes,
  darkReader,
  darkReaderBrightness,
  darkReaderContrast,
  darkReaderGrayscale,
  darkReaderSepia,
  defaultFontSize,
  navigationBar,
  onOpenDialogCustomizeFonts,
  sidebar,
  sidebarSize,
  sidebarTips,
  themeSource,
  titleBar,
  windowButtons,
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
      <Divider />
      <ListItem>
        <ListItemText
          primary="Show sidebar"
          secondary={`Sidebar lets you switch easily between ${getWorkspaceFriendlyName(true).toLowerCase()}.`}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={sidebar}
            onChange={(e) => {
              requestSetPreference('sidebar', e.target.checked);
              requestRealignActiveWorkspace();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Sidebar size"
        />
        <Select
          value={sidebarSize}
          onChange={(e) => {
            requestSetPreference('sidebarSize', e.target.value);
            requestRealignActiveWorkspace();
          }}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classes.selectRoot}
        >
          <MenuItem
            value="compact"
            dense
          >
            Compact
          </MenuItem>
          <MenuItem
            value="expanded"
            dense
          >
            Expanded
          </MenuItem>
        </Select>
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Show tips on sidebar"
        />
        <Select
          value={sidebarSize === 'expanded' ? 'name+shortcut' : sidebarTips}
          onChange={(e) => requestSetPreference('sidebarTips', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classes.selectRoot}
          disabled={sidebarSize === 'expanded'}
        >
          {sidebarSize === 'expanded' && (
            <MenuItem
              value="name+shortcut"
              dense
            >
              {`${getWorkspaceFriendlyName()} names & keyboard shortcuts`}
            </MenuItem>
          )}
          <MenuItem
            value="shortcut"
            dense
          >
            {`${getWorkspaceFriendlyName()} keyboard shortcuts`}
          </MenuItem>
          <MenuItem
            value="name"
            dense
          >
            {`${getWorkspaceFriendlyName()} names`}
          </MenuItem>
          <MenuItem
            value="none"
            dense
          >
            None
          </MenuItem>
        </Select>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          primary="Show navigation bar"
          secondary="Navigation bar lets you go back, forward, home and reload."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            // must show sidebar or navigation bar on Linux
            // if not, as user can't right-click on menu bar icon
            // they can't access preferences or notifications
            checked={(window.process.platform === 'linux' && attachToMenubar && !sidebar) || navigationBar}
            disabled={(window.process.platform === 'linux' && attachToMenubar && !sidebar)}
            onChange={(e) => {
              requestSetPreference('navigationBar', e.target.checked);
              requestRealignActiveWorkspace();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {window.process.platform === 'darwin' && (
        <>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Show title bar"
              secondary="Title bar shows you the title of the current page."
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={titleBar}
                onChange={(e) => {
                  requestSetPreference('titleBar', e.target.checked);
                  requestRealignActiveWorkspace();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </>
      )}
      {window.process.platform === 'darwin' && (
        <>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Show window buttons"
              secondary={'Show "traffic light" (red/orange/green) buttons.'}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={windowButtons}
                onChange={(e) => {
                  requestSetPreference('windowButtons', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </>
      )}
      <Divider />
      <ListItem>
        <ListItemText primary="Font size" />
        <Select
          value={defaultFontSize}
          onChange={(e) => {
            requestSetPreference('defaultFontSize', e.target.value);
            enqueueRequestRestartSnackbar();
          }}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
        >
          {[
            { value: 9, label: 'Very Small' },
            { value: 12, label: 'Small' },
            { value: 16, label: 'Medium (Recommended)' },
            { value: 20, label: 'Large' },
            { value: 24, label: 'Very Large' },
          ].map((item) => (
            <MenuItem key={item.value} dense value={item.value}>{item.label}</MenuItem>
          ))}
          {[9, 12, 16, 20, 24].indexOf(defaultFontSize) < 0 && (
            <MenuItem
              value={defaultFontSize}
              dense
            >
              Custom
            </MenuItem>
          )}
        </Select>
      </ListItem>
      <ListItem button onClick={onOpenDialogCustomizeFonts}>
        <ListItemText primary="Advanced font size settings" />
        <ChevronRightIcon color="action" />
      </ListItem>
    </List>
    <DialogCustomizeFonts />
  </>
);

SectionAppearance.propTypes = {
  attachToMenubar: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  darkReader: PropTypes.bool.isRequired,
  darkReaderBrightness: PropTypes.number.isRequired,
  darkReaderContrast: PropTypes.number.isRequired,
  darkReaderGrayscale: PropTypes.number.isRequired,
  darkReaderSepia: PropTypes.number.isRequired,
  defaultFontSize: PropTypes.number.isRequired,
  navigationBar: PropTypes.bool.isRequired,
  onOpenDialogCustomizeFonts: PropTypes.func.isRequired,
  sidebar: PropTypes.bool.isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  sidebarTips: PropTypes.oneOf(['shortcut', 'name', 'none']).isRequired,
  themeSource: PropTypes.string.isRequired,
  titleBar: PropTypes.bool.isRequired,
  windowButtons: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  attachToMenubar: state.preferences.attachToMenubar,
  darkReader: state.preferences.darkReader,
  darkReaderBrightness: state.preferences.darkReaderBrightness,
  darkReaderContrast: state.preferences.darkReaderContrast,
  darkReaderGrayscale: state.preferences.darkReaderGrayscale,
  darkReaderSepia: state.preferences.darkReaderSepia,
  defaultFontSize: state.preferences.defaultFontSize,
  navigationBar: state.preferences.navigationBar,
  sidebar: state.preferences.sidebar,
  sidebarSize: state.preferences.sidebarSize,
  sidebarTips: state.preferences.sidebarTips,
  themeSource: state.preferences.themeSource,
  titleBar: state.preferences.titleBar,
  windowButtons: state.preferences.windowButtons,
});

const actionCreators = {
  openDialogCustomizeFonts,
};

export default connectComponent(
  SectionAppearance,
  mapStateToProps,
  actionCreators,
  styles,
);
