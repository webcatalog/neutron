import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import semver from 'semver';
import classNames from 'classnames';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import BuildIcon from '@material-ui/icons/Build';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CodeIcon from '@material-ui/icons/Code';
import ExtensionIcon from '@material-ui/icons/Extension';
import LanguageIcon from '@material-ui/icons/Language';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PowerIcon from '@material-ui/icons/Power';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RouterIcon from '@material-ui/icons/Router';
import SecurityIcon from '@material-ui/icons/Security';
import StorefrontIcon from '@material-ui/icons/Storefront';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import WidgetsIcon from '@material-ui/icons/Widgets';

import { TimePicker } from '@material-ui/pickers';

import connectComponent from '../../helpers/connect-component';
import checkLicense from '../../helpers/check-license';

import {
  requestCheckForUpdates,
  requestClearBrowsingData,
  requestOpenInBrowser,
  requestQuit,
  requestRealignActiveWorkspace,
  requestResetPreferences,
  requestSetPreference,
  requestSetSystemPreference,
  requestShowAboutWindow,
  requestShowNotification,
  requestShowNotificationsWindow,
  requestShowRequireRestartDialog,
} from '../../senders';

import { open as openDialogCodeInjection } from '../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../state/dialog-custom-user-agent/actions';
import { open as openDialogInternalUrls } from '../../state/dialog-internal-urls/actions';
import { open as openDialogProxy } from '../../state/dialog-proxy/actions';
import { open as openDialogSpellcheckLanguages } from '../../state/dialog-spellcheck-languages/actions';

import hunspellLanguagesMap from '../../constants/hunspell-languages';
import searchEngines from '../../constants/search-engines';
import autoRefreshIntervals from '../../constants/auto-refresh-intervals';

import ListItemDefaultMailClient from './list-item-default-mail-client';
import ListItemDefaultBrowser from './list-item-default-browser';

import DialogCodeInjection from '../dialog-code-injection';
import DialogCustomUserAgent from '../dialog-custom-user-agent';
import DialogInternalUrls from '../dialog-internal-urls';
import DialogProxy from '../dialog-proxy';
import DialogSpellcheckLanguages from '../dialog-spellcheck-languages';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
  },
  sectionTitle: {
    paddingLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  timePickerContainer: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
  },
  sidebar: {
    position: 'fixed',
    width: 204,
    color: theme.palette.text.primary,
  },
  inner: {
    width: '100%',
    maxWidth: 512,
    float: 'right',
  },
  link: {
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus': {
      textDecoration: 'underline',
    },
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
  listItemPromotion: {
    paddingLeft: theme.spacing(1),
  },
  promotionBlock: {
    display: 'flex',
    flex: 1,
  },
  promotionLeft: {
    height: 64,
    width: 64,
  },
  promotionRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1.5),
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
  refreshEvery: {
    float: 'right',
    paddingRight: theme.spacing(1),
  },
});

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
};

const getUpdaterDesc = (status, info) => {
  if (status === 'download-progress') {
    if (info != null) {
      const { transferred, total, bytesPerSecond } = info;
      return `Downloading updates (${formatBytes(transferred)}/${formatBytes(total)} at ${formatBytes(bytesPerSecond)}/s)...`;
    }
    return 'Downloading updates...';
  }
  if (status === 'checking-for-update') {
    return 'Checking for updates...';
  }
  if (status === 'update-available') {
    return 'Downloading updates...';
  }
  if (status === 'update-downloaded') {
    if (info && info.version) return `A new version (${info.version}) has been downloaded.`;
    return 'A new version has been downloaded.';
  }
  return null;
};

const Preferences = ({
  allowPrerelease,
  askForDownloadPath,
  attachToMenubar,
  autoCheckForUpdates,
  autoRefresh,
  autoRefreshInterval,
  blockAds,
  classes,
  cssCodeInjection,
  customUserAgent,
  darkReader,
  darkReaderBrightness,
  darkReaderContrast,
  darkReaderGrayscale,
  darkReaderSepia,
  downloadPath,
  hibernateUnusedWorkspacesAtLaunch,
  hideMenuBar,
  ignoreCertificateErrors,
  internalUrlRule,
  jsCodeInjection,
  navigationBar,
  onOpenDialogCodeInjection,
  onOpenDialogCustomUserAgent,
  onOpenDialogInternalUrls,
  onOpenDialogProxy,
  onOpenDialogSpellcheckLanguages,
  openAtLogin,
  pauseNotificationsBySchedule,
  pauseNotificationsByScheduleFrom,
  pauseNotificationsByScheduleTo,
  pauseNotificationsMuteAudio,
  rememberLastPageVisited,
  searchEngine,
  sentry,
  shareWorkspaceBrowsingData,
  sidebar,
  sidebarShortcutHints,
  spellcheck,
  spellcheckLanguages,
  swipeToNavigate,
  themeSource,
  titleBar,
  unreadCountBadge,
  updaterInfo,
  updaterStatus,
  useHardwareAcceleration,
}) => {
  const appJson = window.remote.getGlobal('appJson');
  const isSinglebox = appJson.id === 'singlebox';
  const utmSource = isSinglebox ? 'singlebox_app' : 'juli_app';

  const sections = {
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      ref: useRef(),
    },
    extensions: {
      text: 'Extensions',
      Icon: ExtensionIcon,
      ref: useRef(),
    },
    notifications: {
      text: 'Notifications',
      Icon: NotificationsIcon,
      ref: useRef(),
    },
    languages: {
      text: 'Languages',
      Icon: LanguageIcon,
      ref: useRef(),
    },
    downloads: {
      text: 'Downloads',
      Icon: CloudDownloadIcon,
      ref: useRef(),
    },
    network: {
      text: 'Network',
      Icon: RouterIcon,
      ref: useRef(),
    },
    privacy: {
      text: 'Privacy & Security',
      Icon: SecurityIcon,
      ref: useRef(),
    },
    system: {
      text: 'System',
      Icon: BuildIcon,
      ref: useRef(),
    },
    developers: {
      text: 'Developers',
      Icon: CodeIcon,
      ref: useRef(),
    },
    advanced: {
      text: 'Advanced',
      Icon: PowerIcon,
      ref: useRef(),
    },
    updates: {
      text: 'Updates',
      Icon: SystemUpdateAltIcon,
      ref: useRef(),
    },
    reset: {
      text: 'Reset',
      Icon: RotateLeftIcon,
      ref: useRef(),
    },
    atomeryApps: {
      text: 'Atomery Apps',
      Icon: StorefrontIcon,
      ref: useRef(),
    },
    miscs: {
      text: 'Miscellaneous',
      Icon: MoreHorizIcon,
      ref: useRef(),
    },
  };

  useEffect(() => {
    const scrollTo = window.remote.getGlobal('preferencesScrollTo');
    if (!scrollTo) return;
    sections[scrollTo].ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense>
          {Object.keys(sections).map((sectionKey, i) => {
            const {
              Icon, text, ref, hidden,
            } = sections[sectionKey];
            if (hidden) return null;
            return (
              <React.Fragment key={sectionKey}>
                {i > 0 && <Divider />}
                <ListItem button onClick={() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                  />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      </div>
      <div className={classes.inner}>
        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.general.ref}>
          General
        </Typography>
        <Paper elevation={0} className={classes.paper}>
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
                className={classNames(classes.selectRoot, classes.selectRootExtraMargin)}
              >
                <MenuItem dense value="system">System default</MenuItem>
                <MenuItem dense value="light">Light</MenuItem>
                <MenuItem dense value="dark">Dark</MenuItem>
              </Select>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Show sidebar"
                secondary="Sidebar lets you switch easily between workspaces."
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
            <Divider />
            <ListItem>
              <ListItemText
                primary="Show keyboard shortcut hints on sidebar"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={sidebarShortcutHints}
                  onChange={(e) => {
                    requestSetPreference('sidebarShortcutHints', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
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
            <Divider />
            <ListItem>
              <ListItemText
                primary="Search engine"
                secondary="Search engine used in the address bar."
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
            {window.process.platform !== 'darwin' && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Hide menu bar"
                    secondary="Hide the menu bar unless the Alt+M is pressed."
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      color="primary"
                      checked={hideMenuBar}
                      onChange={(e) => {
                        requestSetPreference('hideMenuBar', e.target.checked);
                        requestShowRequireRestartDialog();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </>
            )}
            <Divider />
            <ListItem>
              <ListItemText
                primary={window.process.platform === 'win32'
                  ? 'Attach to taskbar' : 'Attach to menu bar'}
                secondary={window.process.platform !== 'linux' ? 'Tip: Right-click on app icon to access context menu.' : null}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={attachToMenubar}
                  onChange={(e) => {
                    if (!checkLicense()) return;

                    requestSetPreference('attachToMenubar', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.extensions.ref}>
          Extensions
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem>
              <ListItemText
                primary="Block ads &amp; trackers"
                secondary={(
                  <>
                    <span>Powered by </span>
                    <span
                      role="link"
                      tabIndex={0}
                      className={classes.link}
                      onClick={() => requestOpenInBrowser('https://cliqz.com/en/whycliqz/adblocking')}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser('https://cliqz.com/en/whycliqz/adblocking');
                      }}
                    >
                      Cliqz
                    </span>
                    <span>.</span>
                  </>
                )}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={blockAds}
                  onChange={(e) => {
                    if (!checkLicense()) {
                      return;
                    }

                    requestSetPreference('blockAds', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Create dark themes for web pages on the fly"
                secondary={(
                  <>
                    <span>Powered by </span>
                    <span
                      role="link"
                      tabIndex={0}
                      className={classes.link}
                      onClick={() => requestOpenInBrowser('https://darkreader.org/')}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser('https://darkreader.org/');
                      }}
                    >
                      Dark Reader
                    </span>
                    <span>.</span>
                  </>
                )}
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
                primary="Reload web pages automatically"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={autoRefresh}
                  onChange={(e) => {
                    requestSetPreference('autoRefresh', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Reload every" classes={{ primary: classes.refreshEvery }} />
              <Select
                value={autoRefreshInterval}
                onChange={(e) => {
                  requestSetPreference('autoRefreshInterval', e.target.value);
                  requestShowRequireRestartDialog();
                }}
                variant="filled"
                disableUnderline
                margin="dense"
                classes={{
                  root: classes.select,
                }}
                className={classNames(classes.selectRoot, classes.selectRootExtraMargin)}
                disabled={!autoRefresh}
              >
                {autoRefreshIntervals.map((opt) => (
                  <MenuItem key={opt.value} dense value={opt.value}>{opt.name}</MenuItem>
                ))}
              </Select>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.notifications.ref}>
          Notifications
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={requestShowNotificationsWindow}>
              <ListItemText primary="Control notifications" />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText>
                Automatically disable notifications by schedule:
                <div className={classes.timePickerContainer}>
                  <TimePicker
                    autoOk={false}
                    label="from"
                    value={new Date(pauseNotificationsByScheduleFrom)}
                    onChange={(d) => requestSetPreference('pauseNotificationsByScheduleFrom', d.toString())}
                    onClose={() => { window.preventClosingWindow = false; }}
                    onOpen={() => { window.preventClosingWindow = true; }}
                    disabled={!pauseNotificationsBySchedule}
                  />
                  <TimePicker
                    autoOk={false}
                    label="to"
                    value={new Date(pauseNotificationsByScheduleTo)}
                    onChange={(d) => requestSetPreference('pauseNotificationsByScheduleTo', d.toString())}
                    onClose={() => { window.preventClosingWindow = false; }}
                    onOpen={() => { window.preventClosingWindow = true; }}
                    disabled={!pauseNotificationsBySchedule}
                  />
                </div>
                (
                {window.Intl.DateTimeFormat().resolvedOptions().timeZone}
                )
              </ListItemText>
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={pauseNotificationsBySchedule}
                  onChange={(e) => {
                    requestSetPreference('pauseNotificationsBySchedule', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Mute audio when notifications are paused" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={pauseNotificationsMuteAudio}
                  onChange={(e) => {
                    requestSetPreference('pauseNotificationsMuteAudio', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Show unread count badge" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={unreadCountBadge}
                  onChange={(e) => {
                    requestSetPreference('unreadCountBadge', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                requestShowNotification({
                  title: 'Test notifications',
                  body: 'It is working!',
                });
              }}
            >
              <ListItemText
                primary="Test notifications"
                secondary={(() => {
                  // only show this message on macOS Catalina 10.15 & above
                  if (
                    window.process.platform === 'darwin'
                    && semver.gte(window.remote.process.getSystemVersion(), '10.15.0')
                  ) {
                    return (
                      <>
                        <span>If notifications don&apos;t show up,</span>
                        <span> make sure you enable notifications in </span>
                        <b>
                          <span>macOS Preferences &gt; Notifications &gt; </span>
                          {appJson.name}
                        </b>
                        <span>.</span>
                      </>
                    );
                  }
                  return null;
                })()}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                secondary={(
                  <>
                    <span>WebCatalog supports notifications out of the box. </span>
                    <span>But for some web apps, to receive notifications, </span>
                    <span>you will need to manually configure additional </span>
                    <span>web app settings. </span>
                    <span
                      role="link"
                      tabIndex={0}
                      className={classes.link}
                      onClick={() => requestOpenInBrowser(`https://webcatalog.app/web-apps-notifications?utm_source=${utmSource}`)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser(`https://webcatalog.app/web-apps-notifications?utm_source=${utmSource}`);
                      }}
                    >
                      Learn more
                    </span>
                    <span>.</span>
                  </>
                )}
              />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.languages.ref}>
          Languages
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem>
              <ListItemText primary="Spell check" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={spellcheck}
                  onChange={(e) => {
                    requestSetPreference('spellcheck', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {window.process.platform !== 'darwin' && (
              <>
                <Divider />
                <ListItem button onClick={onOpenDialogSpellcheckLanguages}>
                  <ListItemText
                    primary="Spell checking languages"
                    secondary={spellcheckLanguages.map((code) => hunspellLanguagesMap[code]).join(' | ')}
                  />
                  <ChevronRightIcon color="action" />
                </ListItem>
              </>
            )}
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.downloads.ref}>
          Downloads
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem
              button
              onClick={() => {
                window.remote.dialog.showOpenDialog(window.remote.getCurrentWindow(), {
                  properties: ['openDirectory'],
                })
                  .then(({ canceled, filePaths }) => {
                    if (!canceled && filePaths && filePaths.length > 0) {
                      requestSetPreference('downloadPath', filePaths[0]);
                    }
                  })
                  .catch(console.log); // eslint-disable-line
              }}
            >
              <ListItemText
                primary="Download Location"
                secondary={downloadPath}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Ask where to save each file before downloading" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={askForDownloadPath}
                  onChange={(e) => {
                    requestSetPreference('askForDownloadPath', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.network.ref}>
          Network
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={onOpenDialogProxy}>
              <ListItemText primary="Configure proxy settings (BETA)" />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.privacy.ref}>
          Privacy &amp; Security
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem>
              <ListItemText primary="Remember last page visited" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={rememberLastPageVisited}
                  onChange={(e) => {
                    requestSetPreference('rememberLastPageVisited', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Share browsing data between workspaces" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={shareWorkspaceBrowsingData}
                  onChange={(e) => {
                    requestSetPreference('shareWorkspaceBrowsingData', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Ignore certificate errors"
                secondary={(
                  <>
                    <span>Not recommended. </span>
                    <span
                      role="link"
                      tabIndex={0}
                      className={classes.link}
                      onClick={() => requestOpenInBrowser('https://groups.google.com/a/chromium.org/d/msg/security-dev/mB2KJv_mMzM/ddMteO9RjXEJ')}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser('https://groups.google.com/a/chromium.org/d/msg/security-dev/mB2KJv_mMzM/ddMteO9RjXEJ');
                      }}
                    >
                      Learn more
                    </span>
                    .
                  </>
                )}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={ignoreCertificateErrors}
                  onChange={(e) => {
                    requestSetPreference('ignoreCertificateErrors', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button onClick={requestClearBrowsingData}>
              <ListItemText primary="Clear browsing data" secondary="Clear cookies, cache, and more" />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Allow the app to send bug and crash reports on your behalf"
                secondary="Help us quickly diagnose and fix bugs in the app."
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={sentry}
                  onChange={(e) => {
                    requestSetPreference('sentry', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.app/privacy?utm_source=${utmSource}`)}>
              <ListItemText primary="Privacy Policy" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.system.ref}>
          System
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItemDefaultBrowser />
            <Divider />
            <ListItemDefaultMailClient />
            <Divider />
            {window.process.platform !== 'linux' && (
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
                  className={classNames(classes.selectRoot, classes.selectRootExtraMargin)}
                >
                  <MenuItem dense value="yes">Yes</MenuItem>
                  <MenuItem dense value="yes-hidden">Yes, but minimized</MenuItem>
                  <MenuItem dense value="no">No</MenuItem>
                </Select>
              </ListItem>
            )}
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.developers.ref}>
          Developers
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={onOpenDialogCustomUserAgent}>
              <ListItemText
                primary="Custom User Agent"
                secondary={customUserAgent || 'Not set'}
                secondaryTypographyProps={{ noWrap: true }}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                if (!checkLicense()) return;
                onOpenDialogCodeInjection('js');
              }}
            >
              <ListItemText
                primary="JS Code Injection"
                secondary={jsCodeInjection || 'Not set'}
                secondaryTypographyProps={{ noWrap: true }}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                if (!checkLicense()) return;
                onOpenDialogCodeInjection('css');
              }}
            >
              <ListItemText
                primary="CSS Code Injection"
                secondary={cssCodeInjection || 'Not set'}
                secondaryTypographyProps={{ noWrap: true }}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.advanced.ref}>
          Advanced
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={onOpenDialogInternalUrls}>
              <ListItemText
                primary="Internal URLs"
                secondary={internalUrlRule ? `/^${internalUrlRule}$/i` : 'Not set'}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Hibernate unused workspaces at app launch"
                secondary="Hibernate all workspaces at launch, except the last active workspace."
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={hibernateUnusedWorkspacesAtLaunch}
                  onChange={(e) => {
                    requestSetPreference('hibernateUnusedWorkspacesAtLaunch', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {window.process.platform === 'darwin' && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Swipe with three fingers to navigate"
                    secondary={(
                      <>
                        <span>Navigate between pages with 3-finger gestures. </span>
                        <span>Swipe left to go back or swipe right to go forward.</span>
                        <br />
                        <span>To enable it, you also need to change </span>
                        <b>
                          macOS Preferences &gt; Trackpad &gt; More Gestures &gt; Swipe between page
                        </b>
                        <span> to </span>
                        <b>Swipe with three fingers</b>
                        <span> or </span>
                        <b>Swipe with two or three fingers.</b>
                      </>
                    )}
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      color="primary"
                      checked={swipeToNavigate}
                      onChange={(e) => {
                        requestSetPreference('swipeToNavigate', e.target.checked);
                        requestShowRequireRestartDialog();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </>
            )}
            <Divider />
            <ListItem>
              <ListItemText
                primary="Use hardware acceleration when available"
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={useHardwareAcceleration}
                  onChange={(e) => {
                    requestSetPreference('useHardwareAcceleration', e.target.checked);
                    requestShowRequireRestartDialog();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.updates.ref}>
          Updates
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            {appJson.squirrel ? (
              <>
                <ListItem
                  button
                  onClick={() => requestCheckForUpdates(false)}
                  disabled={updaterStatus === 'checking-for-update'
                    || updaterStatus === 'download-progress'
                    || updaterStatus === 'download-progress'
                    || updaterStatus === 'update-available'}
                >
                  <ListItemText
                    primary={updaterStatus === 'update-downloaded' ? 'Restart to Apply Updates' : 'Check for Updates'}
                    secondary={getUpdaterDesc(updaterStatus, updaterInfo)}
                  />
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Receive pre-release updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      color="primary"
                      checked={allowPrerelease}
                      onChange={(e) => {
                        requestSetPreference('allowPrerelease', e.target.checked);
                        requestShowRequireRestartDialog();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </>
            ) : (
              <ListItem
                button
                onClick={requestCheckForUpdates}
              >
                <ListItemText
                  primary="Check for Updates"
                />
                <ChevronRightIcon color="action" />
              </ListItem>
            )}
            <Divider />
            <ListItem>
              <ListItemText primary="Check for updates automatically" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={autoCheckForUpdates}
                  onChange={(e) => {
                    requestSetPreference('autoCheckForUpdates', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.reset.ref}>
          Reset
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={requestResetPreferences}>
              <ListItemText primary="Restore preferences to their original defaults" />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.miscs.ref}>
          Miscellaneous
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={requestShowAboutWindow}>
              <ListItemText primary="About" />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            {isSinglebox ? (
              <>
                <ListItem button onClick={() => requestOpenInBrowser(`https://atomery.com/singlebox?utm_source=${utmSource}`)}>
                  <ListItemText primary="Website" />
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
                <ListItem button onClick={() => requestOpenInBrowser(`https://atomery.com/singlebox/support&utm_source=${utmSource}`)}>
                  <ListItemText primary="Support" />
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
              </>
            ) : (
              <>
                <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.app?utm_source=${utmSource}`)}>
                  <ListItemText primary="WebCatalog Website" />
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
                <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.app/support&utm_source=${utmSource}`)}>
                  <ListItemText primary="WebCatalog Support" />
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
              </>
            )}
            <ListItem button onClick={requestQuit}>
              <ListItemText primary="Quit" />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>
      </div>
      <DialogCodeInjection />
      <DialogCustomUserAgent />
      <DialogSpellcheckLanguages />
      <DialogProxy />
      <DialogInternalUrls />
    </div>
  );
};

Preferences.defaultProps = {
  cssCodeInjection: null,
  customUserAgent: null,
  internalUrlRule: null,
  jsCodeInjection: null,
  updaterInfo: null,
  updaterStatus: null,
};

Preferences.propTypes = {
  allowPrerelease: PropTypes.bool.isRequired,
  askForDownloadPath: PropTypes.bool.isRequired,
  attachToMenubar: PropTypes.bool.isRequired,
  autoCheckForUpdates: PropTypes.bool.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  autoRefreshInterval: PropTypes.number.isRequired,
  blockAds: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  cssCodeInjection: PropTypes.string,
  customUserAgent: PropTypes.string,
  darkReader: PropTypes.bool.isRequired,
  darkReaderBrightness: PropTypes.number.isRequired,
  darkReaderContrast: PropTypes.number.isRequired,
  darkReaderGrayscale: PropTypes.number.isRequired,
  darkReaderSepia: PropTypes.number.isRequired,
  downloadPath: PropTypes.string.isRequired,
  hibernateUnusedWorkspacesAtLaunch: PropTypes.bool.isRequired,
  hideMenuBar: PropTypes.bool.isRequired,
  ignoreCertificateErrors: PropTypes.bool.isRequired,
  internalUrlRule: PropTypes.string,
  jsCodeInjection: PropTypes.string,
  navigationBar: PropTypes.bool.isRequired,
  onOpenDialogCodeInjection: PropTypes.func.isRequired,
  onOpenDialogCustomUserAgent: PropTypes.func.isRequired,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  onOpenDialogProxy: PropTypes.func.isRequired,
  onOpenDialogSpellcheckLanguages: PropTypes.func.isRequired,
  openAtLogin: PropTypes.oneOf(['yes', 'yes-hidden', 'no']).isRequired,
  pauseNotificationsBySchedule: PropTypes.bool.isRequired,
  pauseNotificationsByScheduleFrom: PropTypes.string.isRequired,
  pauseNotificationsByScheduleTo: PropTypes.string.isRequired,
  pauseNotificationsMuteAudio: PropTypes.bool.isRequired,
  rememberLastPageVisited: PropTypes.bool.isRequired,
  searchEngine: PropTypes.string.isRequired,
  sentry: PropTypes.bool.isRequired,
  shareWorkspaceBrowsingData: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  sidebarShortcutHints: PropTypes.bool.isRequired,
  spellcheck: PropTypes.bool.isRequired,
  spellcheckLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  swipeToNavigate: PropTypes.bool.isRequired,
  themeSource: PropTypes.string.isRequired,
  titleBar: PropTypes.bool.isRequired,
  unreadCountBadge: PropTypes.bool.isRequired,
  updaterInfo: PropTypes.object,
  updaterStatus: PropTypes.string,
  useHardwareAcceleration: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  allowPrerelease: state.preferences.allowPrerelease,
  askForDownloadPath: state.preferences.askForDownloadPath,
  attachToMenubar: state.preferences.attachToMenubar,
  autoCheckForUpdates: state.preferences.autoCheckForUpdates,
  autoRefresh: state.preferences.autoRefresh,
  autoRefreshInterval: state.preferences.autoRefreshInterval,
  blockAds: state.preferences.blockAds,
  cssCodeInjection: state.preferences.cssCodeInjection,
  customUserAgent: state.preferences.customUserAgent,
  darkReader: state.preferences.darkReader,
  darkReaderBrightness: state.preferences.darkReaderBrightness,
  darkReaderContrast: state.preferences.darkReaderContrast,
  darkReaderGrayscale: state.preferences.darkReaderGrayscale,
  darkReaderSepia: state.preferences.darkReaderSepia,
  downloadPath: state.preferences.downloadPath,
  hibernateUnusedWorkspacesAtLaunch: state.preferences.hibernateUnusedWorkspacesAtLaunch,
  hideMenuBar: state.preferences.hideMenuBar,
  ignoreCertificateErrors: state.preferences.ignoreCertificateErrors,
  internalUrlRule: state.preferences.internalUrlRule,
  isDefaultMailClient: state.general.isDefaultMailClient,
  isDefaultWebBrowser: state.general.isDefaultWebBrowser,
  jsCodeInjection: state.preferences.jsCodeInjection,
  navigationBar: state.preferences.navigationBar,
  openAtLogin: state.systemPreferences.openAtLogin,
  pauseNotificationsBySchedule: state.preferences.pauseNotificationsBySchedule,
  pauseNotificationsByScheduleFrom: state.preferences.pauseNotificationsByScheduleFrom,
  pauseNotificationsByScheduleTo: state.preferences.pauseNotificationsByScheduleTo,
  pauseNotificationsMuteAudio: state.preferences.pauseNotificationsMuteAudio,
  rememberLastPageVisited: state.preferences.rememberLastPageVisited,
  searchEngine: state.preferences.searchEngine,
  sentry: state.preferences.sentry,
  shareWorkspaceBrowsingData: state.preferences.shareWorkspaceBrowsingData,
  sidebar: state.preferences.sidebar,
  sidebarShortcutHints: state.preferences.sidebarShortcutHints,
  spellcheck: state.preferences.spellcheck,
  spellcheckLanguages: state.preferences.spellcheckLanguages,
  swipeToNavigate: state.preferences.swipeToNavigate,
  themeSource: state.preferences.themeSource,
  titleBar: state.preferences.titleBar,
  unreadCountBadge: state.preferences.unreadCountBadge,
  updaterInfo: state.updater.info,
  updaterStatus: state.updater.status,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
});

const actionCreators = {
  openDialogCodeInjection,
  openDialogCustomUserAgent,
  openDialogInternalUrls,
  openDialogProxy,
  openDialogSpellcheckLanguages,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
