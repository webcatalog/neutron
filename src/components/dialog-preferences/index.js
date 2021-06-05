/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
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
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import {
  getIapFormattedPriceAsync,
} from '../../invokers';

import { open as openDialogProxy } from '../../state/dialog-proxy/actions';

import SectionAdvanced from './section-advanced';
import SectionAppearance from './section-appearance';
import SectionAudioVideo from './section-audio-video';
import SectionDevelopers from './section-developers';
import SectionDownloads from './section-downloads';
import SectionExtensions from './section-extensions';
import SectionGeneral from './section-general';
import SectionLanguages from './section-languages';
import SectionMiscs from './section-miscs';
import SectionNetwork from './section-network';
import SectionNotifications from './section-notifications';
import SectionPrivacySecurity from './section-privacy-security';
import SectionReset from './section-reset';
import SectionUpdates from './section-updates';
import SectionMoreApps from './section-more-apps';

import DialogAppLock from '../dialog-app-lock';
import DialogCodeInjection from '../dialog-code-injection';
import DialogCustomUserAgent from '../dialog-custom-user-agent';
import DialogCustomizeFonts from '../dialog-customize-fonts';
import DialogInternalUrls from '../dialog-internal-urls';
import DialogProxy from '../dialog-proxy';
import DialogRefreshInterval from '../dialog-refresh-interval';
import DialogSpellcheckLanguages from '../dialog-spellcheck-languages';

import SnackbarTrigger from '../shared/snackbar-trigger';

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

const Preferences = ({
  classes,
  iapPurchased,
  standaloneRegistered,
}) => {
  const appJson = getStaticGlobal('appJson');
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
        <SectionNetwork />

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
            <SectionUpdates />
          </>
        )}

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.reset.ref}>
          Reset
        </Typography>
        <SectionReset />

        <Typography variant="subtitle2" color="textPrimary" className={classes.sectionTitle} ref={sections.moreApps.ref}>
          More Apps
        </Typography>
        <SectionMoreApps />

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.miscs.ref}>
          Miscellaneous
        </Typography>
        <SectionMiscs />
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
  standaloneRegistered: false,
};

Preferences.propTypes = {
  classes: PropTypes.object.isRequired,
  iapPurchased: PropTypes.bool,
  standaloneRegistered: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  iapPurchased: state.preferences.iapPurchased,
  standaloneRegistered: state.preferences.standaloneRegistered,
});

const actionCreators = {
  openDialogProxy,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
