/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import isMas from '../../../helpers/is-mas';
import isStandalone from '../../../helpers/is-standalone';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  requestOpenInBrowser,
  requestShowAboutWindow,
  requestShowOpenSourceNoticesWindow,
} from '../../../senders';

const SectionAbout = () => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
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
      <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.io/privacy?utm_source=${utmSource}`)}>
        <ListItemText primary="Privacy Policy" />
        <ChevronRightIcon color="action" />
      </ListItem>
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
    </List>
  );
};

export default SectionAbout;
