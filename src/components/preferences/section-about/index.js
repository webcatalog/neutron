/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState } from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import isAppx from '../../../helpers/is-appx';
import isMas from '../../../helpers/is-mas';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';
import isWebcatalog from '../../../helpers/is-webcatalog';

import {
  requestOpenInBrowser,
} from '../../../senders';

import ListItemAbout from './list-item-about';
import ListItemUpdates from './list-item-updates';
import DialogOpenSourceNotices from './dialog-open-source-notices';

const SectionAbout = () => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  const [openDialogOpenSourceNotices, setOpenDialogOpenSourceNotices] = useState(false);

  return (
    <>
      <List disablePadding dense>
        <ListItemAbout />
        <Divider />
        <ListItemUpdates />
        {isWebcatalog() ? (
          <>
            <ListItem button onClick={() => requestOpenInBrowser(`https://webcatalog.io/webcatalog/?utm_source=${utmSource}`)}>
              <ListItemText primary="Website" />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => requestOpenInBrowser(`https://docs.webcatalog.io?utm_source=${utmSource}`)}>
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
                return requestOpenInBrowser(`https://webcatalog.io?utm_source=${utmSource}`);
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
                  return requestOpenInBrowser(`https://${appJson.hostname}/help/?utm_source=${utmSource}`);
                }
                return requestOpenInBrowser(`https://webcatalog.io/contact/?utm_source=${utmSource}`);
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
          <ListItemText primary="Privacy policy" />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem button onClick={() => setOpenDialogOpenSourceNotices(true)}>
          <ListItemText primary="Open source notices" />
          <ChevronRightIcon color="action" />
        </ListItem>
      </List>

      <DialogOpenSourceNotices
        open={openDialogOpenSourceNotices}
        onClose={() => setOpenDialogOpenSourceNotices(false)}
      />
    </>
  );
};

export default SectionAbout;
