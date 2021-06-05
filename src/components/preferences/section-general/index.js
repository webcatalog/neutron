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
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import checkLicense from '../../../helpers/check-license';
import isMas from '../../../helpers/is-mas';
import isStandalone from '../../../helpers/is-standalone';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  enqueueRequestRestartSnackbar,
  requestOpenInBrowser,
  requestSetPreference,
  requestSetSystemPreference,
} from '../../../senders';

import searchEngines from '../../../constants/search-engines';

import ListItemDefaultMailClient from './list-item-default-mail-client';
import ListItemDefaultBrowser from './list-item-default-browser';
import ListItemDefaultCalendarApp from './list-item-default-calendar-app';

const styles = (theme) => ({
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
  listItemModePicker: {
    paddingLeft: theme.spacing(1),
  },
  modePicker: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1.5),
  },
});

const SectionGeneral = ({
  attachToMenubar,
  classes,
  openAtLogin,
  runInBackground,
  searchEngine,
  shareWorkspaceBrowsingData,
  trayIcon,
}) => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <List disablePadding dense>
      {appJson.url && !isMas() && !isStandalone() && (
        <>
          <ListItem
            button
            onClick={() => {
              window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
                type: 'question',
                buttons: ['Learn More..', 'Later'],
                message: 'You can change the app URL through the WebCatalog app.',
                cancelId: 1,
              }).then(({ response }) => {
                if (response === 0) {
                  requestOpenInBrowser(`https://help.webcatalog.app/article/33-can-i-change-the-url-of-an-installed-app?utm_source=${utmSource}`);
                }
              }).catch(console.log); // eslint-disable-line
            }}
          >
            <ListItemText primary="App URL" secondary={appJson.url} />
            <ChevronRightIcon color="action" />
          </ListItem>
          <Divider />
        </>
      )}
      {(appJson.id.startsWith('group-') || appJson.id === 'clovery') && (
        <>
          <ListItem disableGutters className={classes.listItemModePicker}>
            <div className={classes.modePicker}>
              <Grid container spacing={2}>
                <Grid item>
                  <Radio
                    checked={shareWorkspaceBrowsingData}
                    onChange={(e) => {
                      requestSetPreference('shareWorkspaceBrowsingData', e.target.checked);
                      enqueueRequestRestartSnackbar();
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" gutterBottom={false}>
                    Single Account Mode
                  </Typography>
                  <Typography variant="body2" gutterBottom={false}>
                    Use same login credentials across added services.
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item>
                  <Radio
                    checked={!shareWorkspaceBrowsingData}
                    onChange={(e) => {
                      requestSetPreference('shareWorkspaceBrowsingData', !e.target.checked);
                      enqueueRequestRestartSnackbar();
                    }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" gutterBottom={false}>
                    Multiple Account Mode
                  </Typography>
                  <Typography variant="body2" gutterBottom={false}>
                    Use different login credentials for each added service.
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </ListItem>
          <Divider />
        </>
      )}
      <ListItem>
        <ListItemText
          primary={(() => {
            if (window.process.platform === 'darwin') { return 'Show menu bar icon'; }
            return 'Show tray (notification area) icon';
          })()}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={trayIcon || runInBackground || attachToMenubar}
            disabled={runInBackground || attachToMenubar}
            onChange={(e) => {
              requestSetPreference('trayIcon', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText
          primary={window.process.platform === 'darwin' ? 'Attach window to menu bar' : 'Pin window to system tray (notification area)'}
          secondary="Tip: Right-click on app icon to access context menu."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={attachToMenubar}
            onChange={(e) => {
              // this feature is free with WebCatalog
              // but not free in MAS apps
              if (isMas() && !checkLicense()) {
                return;
              }
              requestSetPreference('attachToMenubar', e.target.checked);
              enqueueRequestRestartSnackbar();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {window.process.platform !== 'darwin' && (
        <>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Run in background"
              secondary="Keep the app running in background even when all windows are closed."
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={attachToMenubar || runInBackground}
                disabled={attachToMenubar}
                onChange={(e) => {
                  requestSetPreference('runInBackground', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </>
      )}
      <Divider />
      <ListItem>
        <ListItemText
          primary="Search engine"
          secondary="Search engine used in the address bar and other contexts."
        />
        <Select
          value={searchEngine}
          onChange={(e) => requestSetPreference('searchEngine', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classes.selectRoot}
        >
          {Object.keys(searchEngines).map((optKey) => {
            const opt = searchEngines[optKey];
            return (
              <MenuItem
                key={optKey}
                value={optKey}
                dense
              >
                {opt.name}
              </MenuItem>
            );
          })}
        </Select>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText primary="Open at login" />
        <Select
          value={openAtLogin}
          onChange={(e) => requestSetSystemPreference('openAtLogin', e.target.value)}
          variant="filled"
          disableUnderline
          margin="dense"
          classes={{
            root: classes.select,
          }}
          className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
        >
          <MenuItem dense value="yes">Yes</MenuItem>
          {window.process.platform === 'darwin' && (
            <MenuItem dense value="yes-hidden">Yes, but minimized</MenuItem>
          )}
          <MenuItem dense value="no">No</MenuItem>
        </Select>
      </ListItem>
      <Divider />
      <ListItemDefaultMailClient />
      {appJson.id !== 'panmail' && (
        <>
          <Divider />
          <ListItemDefaultCalendarApp />
          <Divider />
          <ListItemDefaultBrowser />
        </>
      )}
    </List>
  );
};

SectionGeneral.propTypes = {
  attachToMenubar: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  openAtLogin: PropTypes.oneOf(['yes', 'yes-hidden', 'no']).isRequired,
  runInBackground: PropTypes.bool.isRequired,
  searchEngine: PropTypes.string.isRequired,
  shareWorkspaceBrowsingData: PropTypes.bool.isRequired,
  trayIcon: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  attachToMenubar: state.preferences.attachToMenubar,
  openAtLogin: state.systemPreferences.openAtLogin,
  runInBackground: state.preferences.runInBackground,
  searchEngine: state.preferences.searchEngine,
  shareWorkspaceBrowsingData: state.preferences.shareWorkspaceBrowsingData,
  trayIcon: state.preferences.trayIcon,
});

export default connectComponent(
  SectionGeneral,
  mapStateToProps,
  null,
  styles,
);
