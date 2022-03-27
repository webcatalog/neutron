/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import checkLicense from '../../../helpers/check-license';

import {
  enqueueRequestRestartSnackbar,
  requestOpenInBrowser,
  requestSetPreference,
} from '../../../senders';

const SectionBrowsing = () => {
  const blockAds = useSelector((state) => state.preferences.blockAds);
  const blockJavascript = useSelector((state) => state.preferences.blockJavascript);
  const ignoreCertificateErrors = useSelector((state) => state.preferences.ignoreCertificateErrors);

  return (
    <List disablePadding dense>
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
        <ListItemText
          primary="Disable Javascript"
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={blockJavascript}
            onChange={(e) => {
              requestSetPreference('blockJavascript', e.target.checked);
              enqueueRequestRestartSnackbar();
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
              <Box
                component="span"
                role="link"
                tabIndex={0}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 500,
                  outline: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                  '&:focus': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => requestOpenInBrowser('https://groups.google.com/a/chromium.org/d/msg/security-dev/mB2KJv_mMzM/ddMteO9RjXEJ')}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  requestOpenInBrowser('https://groups.google.com/a/chromium.org/d/msg/security-dev/mB2KJv_mMzM/ddMteO9RjXEJ');
                }}
              >
                Learn more
              </Box>
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
    </List>
  );
};

export default SectionBrowsing;
