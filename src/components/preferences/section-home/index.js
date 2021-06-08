/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  requestOpenInBrowser,
} from '../../../senders';

const SectionHome = () => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
    <List disablePadding dense>
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
    </List>
  );
};

export default SectionHome;
