/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import makeStyles from '@mui/styles/makeStyles';

import isAppx from '../../../helpers/is-appx';
import isMas from '../../../helpers/is-mas';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  requestOpenInBrowser,
} from '../../../senders';

import webcatalogIconPng from '../../../images/products/webcatalog-mac-icon-128@2x.png';
import translatiumIconPng from '../../../images/products/translatium-mac-icon-128@2x.png';
import cloveryIconPng from '../../../images/products/clovery-mac-icon-128@2x.png';
import singleboxIconPng from '../../../images/products/singlebox-mac-icon-128@2x.png';
import switchbarIconPng from '../../../images/products/switchbar-mac-icon-128@2x.png';
import skywhaleIconPng from '../../../images/products/skywhale-mac-icon-128@2x.png';

const useStyles = makeStyles((theme) => ({
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
}));

const SectionMoreApps = () => {
  const classes = useStyles();

  const utmSource = getUtmSource();

  return (
    <List disablePadding dense>
      {!isMas() && !isAppx() && (
        <>
          <ListItem
            button
            onClick={() => {
              const url = `https://webcatalog.io/webcatalog/?utm_source=${utmSource}`;
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
          let url = `https://webcatalog.io/translatium/?utm_source=${utmSource}`;
          if (isMas()) {
            url = 'macappstore://apps.apple.com/app/translatium/id1547052291';
          }
          if (isAppx()) {
            url = 'ms-windows-store://pdp/?ProductId=9MWPG56JKS38';
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
          let url = `https://webcatalog.io/singlebox/?utm_source=${utmSource}`;
          if (isMas()) {
            url = 'macappstore://apps.apple.com/us/app/singlebox-all-in-one-messenger/id1551183766';
          }
          if (isAppx()) {
            url = 'ms-windows-store://pdp/?ProductId=9NH85V7VL3RN';
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
      {!isAppx() && (
        <>
          <Divider />
          <ListItem
            button
            onClick={() => {
              let url = `https://webcatalog.io/switchbar/?utm_source=${utmSource}`;
              if (isMas()) {
                url = 'macappstore://apps.apple.com/app/switchbar/id1555467675';
              }
              requestOpenInBrowser(url);
            }}
            className={classes.listItemPromotion}
          >
            <div className={classes.promotionBlock}>
              <div className={classes.promotionLeft}>
                <img src={switchbarIconPng} alt="Switchbar" className={classes.appIcon} />
              </div>
              <div className={classes.promotionRight}>
                <div>
                  <Typography variant="body1" className={classes.appTitle}>
                    Switchbar
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Browser & Email Client Picker
                  </Typography>
                </div>
              </div>
            </div>
            <ChevronRightIcon color="action" />
          </ListItem>
        </>
      )}
      <Divider />
      <ListItem
        button
        onClick={() => {
          let url = `https://webcatalog.io/clovery/?utm_source=${utmSource}`;
          if (isMas()) {
            url = 'macappstore://apps.apple.com/us/app/clovery-for-google-apps/id1552618413';
          }
          if (isAppx()) {
            url = 'ms-windows-store://pdp/?ProductId=9NT71213J864';
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
      {!isAppx() && (
        <>
          <Divider />
          <ListItem
            button
            onClick={() => {
              let url = `https://webcatalog.io/skywhale/?utm_source=${utmSource}`;
              if (isMas()) {
                url = 'macappstore://apps.apple.com/us/app/skywhale/id1609165212';
              }
              requestOpenInBrowser(url);
            }}
            className={classes.listItemPromotion}
          >
            <div className={classes.promotionBlock}>
              <div className={classes.promotionLeft}>
                <img src={skywhaleIconPng} alt="Skywhale" className={classes.appIcon} />
              </div>
              <div className={classes.promotionRight}>
                <div>
                  <Typography variant="body1" className={classes.appTitle}>
                    Skywhale
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Menu Bar Web Browser
                  </Typography>
                </div>
              </div>
            </div>
            <ChevronRightIcon color="action" />
          </ListItem>
        </>
      )}
    </List>
  );
};

export default SectionMoreApps;
