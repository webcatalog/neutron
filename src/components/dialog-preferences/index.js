/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import semver from 'semver';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CodeIcon from '@material-ui/icons/Code';
import ExtensionIcon from '@material-ui/icons/Extension';
import LanguageIcon from '@material-ui/icons/Language';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PaletteIcon from '@material-ui/icons/Palette';
import PermCameraMicIcon from '@material-ui/icons/PermCameraMic';
import PowerIcon from '@material-ui/icons/Power';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RouterIcon from '@material-ui/icons/Router';
import SecurityIcon from '@material-ui/icons/Security';
import StorefrontIcon from '@material-ui/icons/Storefront';
import UpdateIcon from '@material-ui/icons/Update';
import WidgetsIcon from '@material-ui/icons/Widgets';

import { TimePicker } from '@material-ui/pickers';

import connectComponent from '../../helpers/connect-component';
import checkLicense from '../../helpers/check-license';
import roundTime from '../../helpers/round-time';
import isMas from '../../helpers/is-mas';
import isStandalone from '../../helpers/is-standalone';
import getStaticGlobal from '../../helpers/get-static-global';
import getUtmSource from '../../helpers/get-utm-source';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import {
  enqueueRequestRestartSnackbar,
  requestCheckForUpdates,
  requestClearBrowsingData,
  requestOpenInBrowser,
  requestQuit,
  requestResetPreferences,
  requestSetPreference,
  requestShowAboutWindow,
  requestShowNotification,
  requestShowNotificationsWindow,
  requestShowOpenSourceNoticesWindow,
} from '../../senders';

import {
  getIapFormattedPriceAsync,
} from '../../invokers';

import { open as openDialogAppLock } from '../../state/dialog-app-lock/actions';
import { open as openDialogCodeInjection } from '../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../state/dialog-custom-user-agent/actions';
import { open as openDialogExtensions } from '../../state/dialog-extensions/actions';
import { open as openDialogInternalUrls } from '../../state/dialog-internal-urls/actions';
import { open as openDialogProxy } from '../../state/dialog-proxy/actions';
import { open as openDialogRefreshInterval } from '../../state/dialog-refresh-interval/actions';
import { open as openDialogSpellcheckLanguages } from '../../state/dialog-spellcheck-languages/actions';

import hunspellLanguagesMap from '../../constants/hunspell-languages';
import autoRefreshIntervals from '../../constants/auto-refresh-intervals';

import SectionAudioVideo from './section-audio-video';
import SectionGeneral from './section-general';
import SectionAppearance from './section-appearance';

import DialogAppLock from '../dialog-app-lock';
import DialogCodeInjection from '../dialog-code-injection';
import DialogCustomUserAgent from '../dialog-custom-user-agent';
import DialogCustomizeFonts from '../dialog-customize-fonts';
import DialogInternalUrls from '../dialog-internal-urls';
import DialogProxy from '../dialog-proxy';
import DialogRefreshInterval from '../dialog-refresh-interval';
import DialogSpellcheckLanguages from '../dialog-spellcheck-languages';
import DialogExtensions from '../dialog-extensions';

import SnackbarTrigger from '../shared/snackbar-trigger';

import webcatalogIconPng from '../../images/products/webcatalog-mac-icon-128@2x.png';
import translatiumIconPng from '../../images/products/translatium-mac-icon-128@2x.png';
import cloveryIconPng from '../../images/products/clovery-mac-icon-128@2x.png';
import singleboxIconPng from '../../images/products/singlebox-mac-icon-128@2x.png';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    height: '100%',
    width: '100%',
    overflow: 'auto',
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
    width: 200,
    color: theme.palette.text.primary,
  },
  inner: {
    width: 'calc(100% - 224px)',
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
  appTitle: {},
  appIcon: {
    height: 64,
  },
  listItemModePicker: {
    paddingLeft: theme.spacing(1),
  },
  modePicker: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1.5),
  },
});

const getFileManagerName = () => {
  if (window.process.platform === 'darwin') return 'Finder';
  if (window.process.platform === 'win32') return 'File Explorer';
  return 'file manager';
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
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
  alwaysOnTop,
  askForDownloadPath,
  autoCheckForUpdates,
  autoRefresh,
  autoRefreshInterval,
  autoRefreshOnlyWhenInactive,
  blockAds,
  classes,
  cssCodeInjection,
  customUserAgent,
  downloadPath,
  hibernateUnusedWorkspacesAtLaunch,
  iapPurchased,
  ignoreCertificateErrors,
  internalUrlRule,
  jsCodeInjection,
  onOpenDialogAppLock,
  onOpenDialogCodeInjection,
  onOpenDialogCustomUserAgent,
  onOpenDialogExtensions,
  onOpenDialogInternalUrls,
  onOpenDialogProxy,
  onOpenDialogRefreshInterval,
  onOpenDialogSpellcheckLanguages,
  openFolderWhenDoneDownloading,
  pauseNotificationsBySchedule,
  pauseNotificationsByScheduleFrom,
  pauseNotificationsByScheduleTo,
  pauseNotificationsMuteAudio,
  proxyMode,
  rememberLastPageVisited,
  sentry,
  shareWorkspaceBrowsingData,
  spellcheck,
  spellcheckLanguages,
  standaloneRegistered,
  swipeToNavigate,
  telemetry,
  unreadCountBadge,
  updaterInfo,
  updaterStatus,
  useHardwareAcceleration,
  useSystemTitleBar,
  warnBeforeQuitting,
}) => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();
  const canPromptTouchId = window.process.platform === 'darwin'
    && window.remote.systemPreferences.canPromptTouchID();
  const registered = appJson.registered || iapPurchased || standaloneRegistered;

  const [formattedPrice, setFormattedPrice] = useState(null);
  useEffect(() => {
    if (isMas() && !registered) {
      getIapFormattedPriceAsync(appJson.iapProductIdentifier)
        .then((value) => {
          setFormattedPrice(value);
        });
    } else if (isStandalone()) {
      if (appJson.id === 'panmail') setFormattedPrice('15 USD');
      else setFormattedPrice('20 USD');
    }
  }, [appJson, setFormattedPrice, registered]);

  const sections = {
    licensing: {
      text: 'Licensing',
      Icon: CheckCircleIcon,
      ref: useRef(),
      hidden: isMas() && appJson.registered,
    },
    general: {
      text: 'General',
      Icon: WidgetsIcon,
      ref: useRef(),
    },
    appearance: {
      text: 'Appearance',
      Icon: PaletteIcon,
      ref: useRef(),
    },
    notifications: {
      text: 'Notifications',
      Icon: NotificationsIcon,
      ref: useRef(),
    },
    extensions: {
      text: 'Extensions',
      Icon: ExtensionIcon,
      ref: useRef(),
      hidden: isMas(),
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
    audioVideo: {
      text: 'Audio & Video',
      Icon: PermCameraMicIcon,
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
      Icon: UpdateIcon,
      ref: useRef(),
      hidden: isMas(),
    },
    reset: {
      text: 'Reset',
      Icon: RotateLeftIcon,
      ref: useRef(),
    },
    moreApps: {
      text: 'More Apps',
      Icon: StorefrontIcon,
      ref: useRef(),
      hidden: !isMas() && !isStandalone(),
    },
    miscs: {
      text: 'Miscellaneous',
      Icon: MoreHorizIcon,
      ref: useRef(),
    },
  };

  useEffect(() => {
    const scrollTo = getStaticGlobal('preferencesScrollTo');
    if (!scrollTo) return;
    sections[scrollTo].ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense>
          {Object.keys(sections)
            .filter((sectionKey) => !sections[sectionKey].hidden)
            .map((sectionKey, i) => {
              const {
                Icon, text, ref,
              } = sections[sectionKey];
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
        {(isMas()) && appJson.registered ? null : (
          <>
            <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.licensing.ref}>
              Licensing
            </Typography>
            <Paper elevation={0} className={classes.paper}>
              <List disablePadding dense>
                <ListItem button onClick={null} disabled>
                  <ListItemText primary={registered ? `${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'} is activated.` : `Upgrade to ${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'} (${formattedPrice ? `${formattedPrice}, ` : ''}one-time payment for lifetime use) to unlock all features & add unlimited number of ${getWorkspaceFriendlyName(true).toLowerCase()}.`} />
                </ListItem>
                {!registered && (
                  <>
                    <Divider />
                    <ListItem button onClick={checkLicense}>
                      <ListItemText primary={`Upgrade to ${isMas() || isStandalone() ? `${appJson.name} Plus` : 'WebCatalog Lifetime'}`} />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                  </>
                )}
              </List>
            </Paper>
          </>
        )}

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.general.ref}>
          General
        </Typography>
        <SectionGeneral />

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.appearance.ref}>
          Appearance
        </Typography>
        <SectionAppearance />

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
                      onClick={() => requestOpenInBrowser(`https://help.webcatalog.app/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser(`https://help.webcatalog.app/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`);
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

        {!isMas() && (
          <>
            <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.extensions.ref}>
              Extensions (experimental)
            </Typography>
            <Paper elevation={0} className={classes.paper}>
              <List disablePadding dense>
                <ListItem button onClick={() => onOpenDialogExtensions()}>
                  <ListItemText primary="Manage extensions (experimental)" />
                  <ChevronRightIcon color="action" />
                </ListItem>
              </List>
            </Paper>
            <DialogExtensions />
          </>
        )}

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
                    enqueueRequestRestartSnackbar();
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
            {!isMas() && (
              <>
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
              </>
            )}
            <ListItem>
              <ListItemText
                primary="Ask where to save each file before downloading"
                secondary={isMas() ? 'Otherwise, download files are always saved to ~/Downloads folder.' : null}
              />
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
            <Divider />
            <ListItem>
              <ListItemText primary={`Reveal the file in ${getFileManagerName()} when it is downloaded`} />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={openFolderWhenDoneDownloading}
                  onChange={(e) => {
                    requestSetPreference('openFolderWhenDoneDownloading', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.audioVideo.ref}>
          Audio & Video
        </Typography>
        <SectionAudioVideo classes={classes} />

        <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.network.ref}>
          Network
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={onOpenDialogProxy}>
              <ListItemText
                primary="Proxy"
                secondary={(() => {
                  switch (proxyMode) {
                    case 'fixed_servers': {
                      return 'Using proxy server.';
                    }
                    case 'pac_script': {
                      return 'Using PAC script (automatic proxy configuration script).';
                    }
                    case 'system': {
                      return 'Using system proxy configurations.';
                    }
                    default: {
                      return 'Not configured.';
                    }
                  }
                })()}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.privacy.ref}>
          Privacy &amp; Security
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={requestClearBrowsingData}>
              <ListItemText primary="Clear browsing data" secondary="Clear cookies, cache, and more." />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                if (!checkLicense()) {
                  return;
                }

                onOpenDialogAppLock();
              }}
            >
              <ListItemText
                primary="App Lock"
                secondary={`Protect this app from unauthorized access with password${canPromptTouchId ? ' or Touch ID' : ''}.`}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                primary="Block ads &amp; trackers"
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
                    enqueueRequestRestartSnackbar();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Remember last page visited" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={rememberLastPageVisited}
                  onChange={(e) => {
                    requestSetPreference('rememberLastPageVisited', e.target.checked);
                    enqueueRequestRestartSnackbar();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {!appJson.id.startsWith('group-') && appJson.id !== 'clovery' && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText primary="Share browsing data & login credentials between services & accounts" />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      color="primary"
                      checked={shareWorkspaceBrowsingData}
                      onChange={(e) => {
                        requestSetPreference('shareWorkspaceBrowsingData', e.target.checked);
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
                    enqueueRequestRestartSnackbar();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            {(isMas() || isStandalone()) && (
              <>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Allow the app to send anonymous crash reports"
                    secondary="Help us quickly diagnose and fix bugs in the app."
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      color="primary"
                      checked={sentry}
                      onChange={(e) => {
                        requestSetPreference('sentry', e.target.checked);
                        enqueueRequestRestartSnackbar();
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Allow the app to send anonymous usage data"
                    secondary="Help us understand how to improve the product."
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      color="primary"
                      checked={telemetry}
                      onChange={(e) => {
                        requestSetPreference('telemetry', e.target.checked);
                      }}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </>
            )}
            <Divider />
            <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.app/privacy?utm_source=${utmSource}`)}>
              <ListItemText primary="Privacy Policy" />
              <ChevronRightIcon color="action" />
            </ListItem>
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
                primary={`Hibernate unused ${getWorkspaceFriendlyName(true).toLowerCase()} at app launch`}
                secondary={`Hibernate all ${getWorkspaceFriendlyName(true).toLowerCase()} at launch, except the last active ${getWorkspaceFriendlyName().toLowerCase()}.`}
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
                        enqueueRequestRestartSnackbar();
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
                    primary="Use system title bar and borders"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      edge="end"
                      color="primary"
                      checked={useSystemTitleBar}
                      onChange={(e) => {
                        requestSetPreference('useSystemTitleBar', e.target.checked);
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
                primary="Keep window always on top"
                secondary="The window won't be hidden even when you click outside."
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={alwaysOnTop}
                  onChange={(e) => {
                    requestSetPreference('alwaysOnTop', e.target.checked);
                    enqueueRequestRestartSnackbar();
                  }}
                />
              </ListItemSecondaryAction>
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
                    enqueueRequestRestartSnackbar();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Reload every" classes={{ primary: classes.refreshEvery }} />
              <Select
                value={autoRefreshInterval}
                onChange={(e) => {
                  if (e.target.value === 'custom') {
                    onOpenDialogRefreshInterval();
                    return;
                  }
                  requestSetPreference('autoRefreshInterval', e.target.value);
                  enqueueRequestRestartSnackbar();
                }}
                variant="filled"
                disableUnderline
                margin="dense"
                classes={{
                  root: classes.select,
                }}
                className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                disabled={!autoRefresh}
              >
                {autoRefreshIntervals.map((opt) => (
                  <MenuItem key={opt.value} dense value={opt.value}>{opt.name}</MenuItem>
                ))}
                {(() => {
                  const isCustom = autoRefreshIntervals
                    .find((interval) => interval.value === autoRefreshInterval) == null;
                  if (isCustom) {
                    const time = roundTime(autoRefreshInterval);
                    return (
                      <MenuItem dense value={autoRefreshInterval}>
                        {`${time.value} ${time.unit}`}
                      </MenuItem>
                    );
                  }
                  return null;
                })()}
                <MenuItem dense value="custom">Custom</MenuItem>
              </Select>
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Only reload on inactivity"
                secondary={(
                  <>
                    <span>Keep certain apps from logging </span>
                    <span>out automatically when you are away. </span>
                    <span
                      role="link"
                      tabIndex={0}
                      className={classes.link}
                      onClick={() => requestOpenInBrowser(`https://help.webcatalog.app/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${utmSource}`)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser(`https://help.webcatalog.app/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${utmSource}`);
                      }}
                    >
                      Learn more
                    </span>
                    <span>.</span>
                  </>
                )}
              />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={autoRefreshOnlyWhenInactive}
                  disabled={!autoRefresh}
                  onChange={(e) => {
                    requestSetPreference('autoRefreshOnlyWhenInactive', e.target.checked);
                    enqueueRequestRestartSnackbar();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
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
                    enqueueRequestRestartSnackbar();
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {!isMas() && (
          <>
            <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.updates.ref}>
              Updates
            </Typography>
            {isStandalone() ? (
              <Paper elevation={0} className={classes.paper}>
                <List disablePadding dense>
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
                </List>
              </Paper>
            ) : (
              <Paper elevation={0} className={classes.paper}>
                <List disablePadding dense>
                  <ListItem
                    button
                    onClick={requestCheckForUpdates}
                  >
                    <ListItemText
                      primary="Check for updates"
                    />
                    <ChevronRightIcon color="action" />
                  </ListItem>
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
            )}
          </>
        )}

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.reset.ref}>
          Reset
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem
              button
              onClick={() => {
                window.remote.dialog.showMessageBox(window.remote.getCurrentWindow(), {
                  type: 'question',
                  buttons: ['Reset Now', 'Cancel'],
                  message: `Are you sure? All preferences will be restored to their original defaults. Browsing data & ${getWorkspaceFriendlyName(true).toLowerCase()} won't be affected. This action cannot be undone.`,
                  cancelId: 1,
                }).then(({ response }) => {
                  if (response === 0) {
                    window.ipcRenderer.once('set-preferences', () => {
                      enqueueRequestRestartSnackbar();
                    });
                    requestResetPreferences();
                  }
                }).catch(console.log); // eslint-disable-line
              }}
            >
              <ListItemText primary="Restore preferences to their original defaults" />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>

        {/* Apple doesn't allow linking to app distributed outside Mac App Store version,
          citing Guideline 2.4.5(iv) - Performance
          They may not download or install standalone apps, kexts,
          additional code, or resources to add functionality
          or significantly change the app from what
          we see during the review process. */}
        {(isMas() || isStandalone()) && (
          <>
            <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.moreApps.ref}>
              More Apps
            </Typography>
            <Paper elevation={0} className={classes.paper}>
              <List disablePadding dense>
                {!isMas() && (
                  <>
                    <ListItem
                      button
                      onClick={() => {
                        const url = `https://webcatalog.app?utm_source=${utmSource}`;
                        requestOpenInBrowser(url);
                      }}
                      className={classes.listItemPromotion}
                    >
                      <div className={classes.promotionBlock}>
                        <div className={classes.promotionLeft}>
                          <img src={webcatalogIconPng} alt="WebCatalog" className={classes.appIcon} />
                        </div>
                        <div className={classes.promotionRight}>
                          <div>
                            <Typography variant="body1" className={classes.appTitle}>
                              WebCatalog
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Turn Any Websites Into Real Desktop Apps
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <Divider />
                  </>
                )}
                <ListItem
                  button
                  onClick={() => {
                    let url = `https://translatium.app?utm_source=${utmSource}`;
                    if (isMas()) {
                      url = 'macappstore://apps.apple.com/app/translatium/id1547052291';
                    }
                    requestOpenInBrowser(url);
                  }}
                  className={classes.listItemPromotion}
                >
                  <div className={classes.promotionBlock}>
                    <div className={classes.promotionLeft}>
                      <img src={translatiumIconPng} alt="Translatium" className={classes.appIcon} />
                    </div>
                    <div className={classes.promotionRight}>
                      <div>
                        <Typography variant="body1" className={classes.appTitle}>
                          Translatium
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Translate 100+ Languages Instantly
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    let url = `https://singlebox.app?utm_source=${utmSource}`;
                    if (isMas()) {
                      url = 'macappstore://apps.apple.com/us/app/singlebox-all-in-one-messenger/id1551183766';
                    }
                    requestOpenInBrowser(url);
                  }}
                  className={classes.listItemPromotion}
                >
                  <div className={classes.promotionBlock}>
                    <div className={classes.promotionLeft}>
                      <img src={singleboxIconPng} alt="Singlebox" className={classes.appIcon} />
                    </div>
                    <div className={classes.promotionRight}>
                      <div>
                        <Typography variant="body1" className={classes.appTitle}>
                          Singlebox
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          All-in-One Messenger
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon color="action" />
                </ListItem>
                <Divider />
                <ListItem
                  button
                  onClick={() => {
                    let url = `https://clovery.app?utm_source=${utmSource}`;
                    if (isMas()) {
                      url = 'macappstore://apps.apple.com/us/app/clovery-for-google-apps/id1552618413';
                    }
                    requestOpenInBrowser(url);
                  }}
                  className={classes.listItemPromotion}
                >
                  <div className={classes.promotionBlock}>
                    <div className={classes.promotionLeft}>
                      <img src={cloveryIconPng} alt="Clovery" className={classes.appIcon} />
                    </div>
                    <div className={classes.promotionRight}>
                      <div>
                        <Typography variant="body1" className={classes.appTitle}>
                          Clovery
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          All Google Apps in One
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <ChevronRightIcon color="action" />
                </ListItem>
              </List>
            </Paper>
          </>
        )}

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
            {(() => {
              if (isMas()) {
                return (
                  <>
                    <ListItem
                      button
                      onClick={() => {
                        if (appJson.hostname) {
                          return requestOpenInBrowser(`https://${appJson.hostname}?utm_source=${utmSource}`);
                        }
                        return requestOpenInBrowser(`https://${appJson.id}.app?utm_source=${utmSource}`);
                      }}
                    >
                      <ListItemText primary="Website" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => {
                        if (appJson.hostname) {
                          return requestOpenInBrowser(`https://${appJson.hostname}/help?utm_source=${utmSource}`);
                        }
                        return requestOpenInBrowser(`https://${appJson.id}.app/help?utm_source=${utmSource}`);
                      }}
                    >
                      <ListItemText primary="Help" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => requestOpenInBrowser(`macappstore://apps.apple.com/app/id${appJson.macAppStoreId}`)}
                    >
                      <ListItemText primary="Mac App Store" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => requestOpenInBrowser(`macappstore://apps.apple.com/app/id${appJson.macAppStoreId}?action=write-review`)}
                    >
                      <ListItemText primary={`Rate ${appJson.name} on Mac App Store`} />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                  </>
                );
              }

              if (isStandalone()) {
                return (
                  <>
                    <ListItem
                      button
                      onClick={() => {
                        if (appJson.hostname) {
                          return requestOpenInBrowser(`https://${appJson.hostname}?utm_source=${utmSource}`);
                        }
                        return requestOpenInBrowser(`https://${appJson.id}.app?utm_source=${utmSource}`);
                      }}
                    >
                      <ListItemText primary="Website" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                    <Divider />
                    <ListItem
                      button
                      onClick={() => {
                        if (appJson.hostname) {
                          return requestOpenInBrowser(`https://${appJson.hostname}/help?utm_source=${utmSource}`);
                        }
                        return requestOpenInBrowser(`https://${appJson.id}.app/help?utm_source=${utmSource}`);
                      }}
                    >
                      <ListItemText primary="Help" />
                      <ChevronRightIcon color="action" />
                    </ListItem>
                  </>
                );
              }

              return (
                <>
                  <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.app?utm_source=${utmSource}`)}>
                    <ListItemText primary="WebCatalog Website" />
                    <ChevronRightIcon color="action" />
                  </ListItem>
                  <Divider />
                  <ListItem button onClick={() => requestOpenInBrowser(`https://help.webcatalog.app?utm_source=${utmSource}`)}>
                    <ListItemText primary="WebCatalog Help" />
                    <ChevronRightIcon color="action" />
                  </ListItem>
                </>
              );
            })()}
            <Divider />
            <ListItem button onClick={requestShowOpenSourceNoticesWindow}>
              <ListItemText primary="Open Source Notices" />
              <ChevronRightIcon color="action" />
            </ListItem>
            {!isMas() && !isStandalone() && (
              <>
                <Divider />
                <ListItem button onClick={() => requestOpenInBrowser('https://twitter.com/webcatalog_app')}>
                  <ListItemText primary="Find Us on Twitter" />
                  <ChevronRightIcon color="action" />
                </ListItem>
              </>
            )}
            <Divider />
            <ListItem>
              <ListItemText primary="Warn before quitting" />
              <ListItemSecondaryAction>
                <Switch
                  edge="end"
                  color="primary"
                  checked={warnBeforeQuitting}
                  onChange={(e) => {
                    requestSetPreference('warnBeforeQuitting', e.target.checked);
                  }}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem button onClick={requestQuit}>
              <ListItemText primary="Quit" />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>
      </div>
      <DialogAppLock />
      <DialogCodeInjection />
      <DialogCustomUserAgent />
      <DialogSpellcheckLanguages />
      <DialogProxy />
      <DialogInternalUrls />
      <DialogRefreshInterval />
      <DialogCustomizeFonts />
      <SnackbarTrigger />
    </div>
  );
};

Preferences.defaultProps = {
  cssCodeInjection: null,
  customUserAgent: null,
  iapPurchased: false,
  internalUrlRule: null,
  jsCodeInjection: null,
  standaloneRegistered: false,
  updaterInfo: null,
  updaterStatus: null,
};

Preferences.propTypes = {
  alwaysOnTop: PropTypes.bool.isRequired,
  askForDownloadPath: PropTypes.bool.isRequired,
  autoCheckForUpdates: PropTypes.bool.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  autoRefreshInterval: PropTypes.number.isRequired,
  autoRefreshOnlyWhenInactive: PropTypes.bool.isRequired,
  blockAds: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  cssCodeInjection: PropTypes.string,
  customUserAgent: PropTypes.string,
  downloadPath: PropTypes.string.isRequired,
  hibernateUnusedWorkspacesAtLaunch: PropTypes.bool.isRequired,
  iapPurchased: PropTypes.bool,
  ignoreCertificateErrors: PropTypes.bool.isRequired,
  internalUrlRule: PropTypes.string,
  jsCodeInjection: PropTypes.string,
  onOpenDialogAppLock: PropTypes.func.isRequired,
  onOpenDialogCodeInjection: PropTypes.func.isRequired,
  onOpenDialogCustomUserAgent: PropTypes.func.isRequired,
  onOpenDialogExtensions: PropTypes.func.isRequired,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  onOpenDialogProxy: PropTypes.func.isRequired,
  onOpenDialogRefreshInterval: PropTypes.func.isRequired,
  onOpenDialogSpellcheckLanguages: PropTypes.func.isRequired,
  openFolderWhenDoneDownloading: PropTypes.bool.isRequired,
  pauseNotificationsBySchedule: PropTypes.bool.isRequired,
  pauseNotificationsByScheduleFrom: PropTypes.string.isRequired,
  pauseNotificationsByScheduleTo: PropTypes.string.isRequired,
  pauseNotificationsMuteAudio: PropTypes.bool.isRequired,
  proxyMode: PropTypes.oneOf(['direct', 'fixed_servers', 'pac_script', 'system']).isRequired,
  rememberLastPageVisited: PropTypes.bool.isRequired,
  sentry: PropTypes.bool.isRequired,
  shareWorkspaceBrowsingData: PropTypes.bool.isRequired,
  spellcheck: PropTypes.bool.isRequired,
  spellcheckLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  standaloneRegistered: PropTypes.bool,
  swipeToNavigate: PropTypes.bool.isRequired,
  telemetry: PropTypes.bool.isRequired,
  unreadCountBadge: PropTypes.bool.isRequired,
  updaterInfo: PropTypes.object,
  updaterStatus: PropTypes.string,
  useHardwareAcceleration: PropTypes.bool.isRequired,
  useSystemTitleBar: PropTypes.bool.isRequired,
  warnBeforeQuitting: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  alwaysOnTop: state.preferences.alwaysOnTop,
  askForDownloadPath: state.preferences.askForDownloadPath,
  autoCheckForUpdates: state.preferences.autoCheckForUpdates,
  autoRefresh: state.preferences.autoRefresh,
  autoRefreshInterval: state.preferences.autoRefreshInterval,
  autoRefreshOnlyWhenInactive: state.preferences.autoRefreshOnlyWhenInactive,
  blockAds: state.preferences.blockAds,
  cssCodeInjection: state.preferences.cssCodeInjection,
  customUserAgent: state.preferences.customUserAgent,
  defaultFontSize: state.preferences.defaultFontSize,
  downloadPath: state.preferences.downloadPath,
  hibernateUnusedWorkspacesAtLaunch: state.preferences.hibernateUnusedWorkspacesAtLaunch,
  iapPurchased: state.preferences.iapPurchased,
  ignoreCertificateErrors: state.preferences.ignoreCertificateErrors,
  internalUrlRule: state.preferences.internalUrlRule,
  jsCodeInjection: state.preferences.jsCodeInjection,
  openFolderWhenDoneDownloading: state.preferences.openFolderWhenDoneDownloading,
  pauseNotificationsBySchedule: state.preferences.pauseNotificationsBySchedule,
  pauseNotificationsByScheduleFrom: state.preferences.pauseNotificationsByScheduleFrom,
  pauseNotificationsByScheduleTo: state.preferences.pauseNotificationsByScheduleTo,
  pauseNotificationsMuteAudio: state.preferences.pauseNotificationsMuteAudio,
  proxyMode: state.preferences.proxyMode,
  rememberLastPageVisited: state.preferences.rememberLastPageVisited,
  sentry: state.preferences.sentry,
  shareWorkspaceBrowsingData: state.preferences.shareWorkspaceBrowsingData,
  spellcheck: state.preferences.spellcheck,
  spellcheckLanguages: state.preferences.spellcheckLanguages,
  standaloneRegistered: state.preferences.standaloneRegistered,
  swipeToNavigate: state.preferences.swipeToNavigate,
  telemetry: state.preferences.telemetry,
  unreadCountBadge: state.preferences.unreadCountBadge,
  updaterInfo: state.updater.info,
  updaterStatus: state.updater.status,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
  useSystemTitleBar: state.preferences.useSystemTitleBar,
  warnBeforeQuitting: state.preferences.warnBeforeQuitting,
});

const actionCreators = {
  openDialogAppLock,
  openDialogCodeInjection,
  openDialogCustomUserAgent,
  openDialogExtensions,
  openDialogInternalUrls,
  openDialogProxy,
  openDialogRefreshInterval,
  openDialogSpellcheckLanguages,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
