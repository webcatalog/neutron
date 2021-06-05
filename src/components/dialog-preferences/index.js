/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
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

import connectComponent from '../../helpers/connect-component';
import checkLicense from '../../helpers/check-license';
import isMas from '../../helpers/is-mas';
import isStandalone from '../../helpers/is-standalone';
import getStaticGlobal from '../../helpers/get-static-global';
import getUtmSource from '../../helpers/get-utm-source';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import {
  enqueueRequestRestartSnackbar,
  requestCheckForUpdates,
  requestOpenInBrowser,
  requestQuit,
  requestResetPreferences,
  requestSetPreference,
  requestShowAboutWindow,
  requestShowOpenSourceNoticesWindow,
} from '../../senders';

import {
  getIapFormattedPriceAsync,
} from '../../invokers';

import { open as openDialogInternalUrls } from '../../state/dialog-internal-urls/actions';
import { open as openDialogProxy } from '../../state/dialog-proxy/actions';
import { open as openDialogRefreshInterval } from '../../state/dialog-refresh-interval/actions';

import SectionAudioVideo from './section-audio-video';
import SectionGeneral from './section-general';
import SectionAppearance from './section-appearance';
import SectionNotifications from './section-notifications';
import SectionPrivacySecurity from './section-privacy-security';
import SectionExtensions from './section-extensions';
import SectionLanguages from './section-languages';
import SectionDevelopers from './section-developers';
import SectionDownloads from './section-downloads';
import SectionAdvanced from './section-advanced';

import DialogAppLock from '../dialog-app-lock';
import DialogCodeInjection from '../dialog-code-injection';
import DialogCustomUserAgent from '../dialog-custom-user-agent';
import DialogCustomizeFonts from '../dialog-customize-fonts';
import DialogInternalUrls from '../dialog-internal-urls';
import DialogProxy from '../dialog-proxy';
import DialogRefreshInterval from '../dialog-refresh-interval';
import DialogSpellcheckLanguages from '../dialog-spellcheck-languages';

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
  autoCheckForUpdates,
  autoRefresh,
  autoRefreshInterval,
  autoRefreshOnlyWhenInactive,
  classes,
  hibernateUnusedWorkspacesAtLaunch,
  iapPurchased,
  internalUrlRule,
  onOpenDialogInternalUrls,
  onOpenDialogProxy,
  onOpenDialogRefreshInterval,
  proxyMode,
  standaloneRegistered,
  swipeToNavigate,
  updaterInfo,
  updaterStatus,
  useHardwareAcceleration,
  useSystemTitleBar,
  warnBeforeQuitting,
}) => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();
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
        <SectionNotifications />

        {!isMas() && (
          <>
            <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.extensions.ref}>
              Extensions (experimental)
            </Typography>
            <SectionExtensions />
          </>
        )}

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.languages.ref}>
          Languages
        </Typography>
        <SectionLanguages />

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.downloads.ref}>
          Downloads
        </Typography>
        <SectionDownloads />

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
        <SectionPrivacySecurity />

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.developers.ref}>
          Developers
        </Typography>
        <SectionDevelopers />

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.advanced.ref}>
          Advanced
        </Typography>
        <SectionAdvanced />

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
  iapPurchased: false,
  internalUrlRule: null,
  standaloneRegistered: false,
  updaterInfo: null,
  updaterStatus: null,
};

Preferences.propTypes = {
  alwaysOnTop: PropTypes.bool.isRequired,
  autoCheckForUpdates: PropTypes.bool.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  autoRefreshInterval: PropTypes.number.isRequired,
  autoRefreshOnlyWhenInactive: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  hibernateUnusedWorkspacesAtLaunch: PropTypes.bool.isRequired,
  iapPurchased: PropTypes.bool,
  internalUrlRule: PropTypes.string,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  onOpenDialogProxy: PropTypes.func.isRequired,
  onOpenDialogRefreshInterval: PropTypes.func.isRequired,
  proxyMode: PropTypes.oneOf(['direct', 'fixed_servers', 'pac_script', 'system']).isRequired,
  standaloneRegistered: PropTypes.bool,
  swipeToNavigate: PropTypes.bool.isRequired,
  updaterInfo: PropTypes.object,
  updaterStatus: PropTypes.string,
  useHardwareAcceleration: PropTypes.bool.isRequired,
  useSystemTitleBar: PropTypes.bool.isRequired,
  warnBeforeQuitting: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  alwaysOnTop: state.preferences.alwaysOnTop,
  autoCheckForUpdates: state.preferences.autoCheckForUpdates,
  autoRefresh: state.preferences.autoRefresh,
  autoRefreshInterval: state.preferences.autoRefreshInterval,
  autoRefreshOnlyWhenInactive: state.preferences.autoRefreshOnlyWhenInactive,
  defaultFontSize: state.preferences.defaultFontSize,
  hibernateUnusedWorkspacesAtLaunch: state.preferences.hibernateUnusedWorkspacesAtLaunch,
  iapPurchased: state.preferences.iapPurchased,
  internalUrlRule: state.preferences.internalUrlRule,
  proxyMode: state.preferences.proxyMode,
  standaloneRegistered: state.preferences.standaloneRegistered,
  swipeToNavigate: state.preferences.swipeToNavigate,
  updaterInfo: state.updater.info,
  updaterStatus: state.updater.status,
  useHardwareAcceleration: state.preferences.useHardwareAcceleration,
  useSystemTitleBar: state.preferences.useSystemTitleBar,
  warnBeforeQuitting: state.preferences.warnBeforeQuitting,
});

const actionCreators = {
  openDialogInternalUrls,
  openDialogProxy,
  openDialogRefreshInterval,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
