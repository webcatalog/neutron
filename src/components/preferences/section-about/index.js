/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import isAppx from '../../../helpers/is-appx';
import isMas from '../../../helpers/is-mas';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  requestOpenInBrowser,
  requestShowOpenSourceNoticesWindow,
} from '../../../senders';

import ListItemAbout from './list-item-about';
import ListItemUpdates from './list-item-updates';
import isWebcatalog from '../../../helpers/is-webcatalog';

const SectionAbout = () => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <List disablePadding dense>
      <ListItemAbout />
      <Divider />
      <ListItemUpdates />
      {isWebcatalog() ? (
        <>
          <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.app?utm_source=${utmSource}`)}>
            <ListItemText primary="Website" />
            <ChevronRightIcon color="action" />
          </ListItem>
          <Divider />
          <ListItem button onClick={() => requestOpenInBrowser(`https://help.webcatalog.app?utm_source=${utmSource}`)}>
            <ListItemText primary="Help" />
            <ChevronRightIcon color="action" />
          </ListItem>
        </>
      ) : (
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
          {isMas() && (
            <>
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
          )}
          {isAppx() && (
            <>
              <Divider />
              <ListItem
                button
                onClick={() => requestOpenInBrowser(`ms-windows-store://pdp/?ProductId=${appJson.microsoftStoreId}`)}
              >
                <ListItemText primary="Microsoft Store" />
                <ChevronRightIcon color="action" />
              </ListItem>
              <Divider />
              <ListItem
                button
                onClick={() => requestOpenInBrowser(`macappstore://apps.apple.com/app/id${appJson.macAppStoreId}?action=write-review`)}
              >
                <ListItemText primary={`Rate ${appJson.name} on Microsoft Store`} />
                <ChevronRightIcon color="action" />
              </ListItem>
            </>
          )}
        </>
      )}
      <Divider />
      <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.io/privacy?utm_source=${utmSource}`)}>
        <ListItemText primary="Privacy Policy" />
        <ChevronRightIcon color="action" />
      </ListItem>
      <Divider />
      <ListItem button onClick={requestShowOpenSourceNoticesWindow}>
        <ListItemText primary="Open Source Notices" />
        <ChevronRightIcon color="action" />
      </ListItem>
    </List>
  );
};

export default SectionAbout;
