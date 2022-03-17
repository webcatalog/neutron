/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { useDispatch, useSelector } from 'react-redux';

import {
  requestSetPreference,
} from '../../../senders';

import { open as openDialogCodeInjection } from '../../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../../state/dialog-custom-user-agent/actions';

import DialogCodeInjection from '../../shared/dialog-code-injection';
import DialogCustomUserAgent from '../../shared/dialog-custom-user-agent';

const DialogDevelopers = () => {
  const dispatch = useDispatch();

  const cssCodeInjection = useSelector((state) => state.preferences.cssCodeInjection);
  const customUserAgent = useSelector((state) => state.preferences.customUserAgent);
  const forceMobileView = useSelector((state) => state.preferences.forceMobileView);
  const jsCodeInjection = useSelector((state) => state.preferences.jsCodeInjection);

  return (
    <>
      <List disablePadding dense>
        <ListItem>
          <ListItemText
            primary="Force mobile view"
            secondary="Force some websites to use their mobile versions by using mobile User-Agent string."
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={forceMobileView}
              onChange={(e) => {
                requestSetPreference('forceMobileView', e.target.checked);
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem button onClick={dispatch(openDialogCustomUserAgent)} disabled={forceMobileView}>
          <ListItemText
            primary="Custom User-Agent string"
            secondary={forceMobileView ? 'Chrome (Android) UA string' : (customUserAgent || 'Not set')}
            secondaryTypographyProps={{ noWrap: true }}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            dispatch(openDialogCodeInjection('js'));
          }}
        >
          <ListItemText
            primary="JS code injection"
            secondary={jsCodeInjection || 'Not set'}
            secondaryTypographyProps={{ noWrap: true }}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
        <Divider />
        <ListItem
          button
          onClick={() => {
            dispatch(openDialogCodeInjection('css'));
          }}
        >
          <ListItemText
            primary="CSS code injection"
            secondary={cssCodeInjection || 'Not set'}
            secondaryTypographyProps={{ noWrap: true }}
          />
          <ChevronRightIcon color="action" />
        </ListItem>
      </List>
      <DialogCodeInjection />
      <DialogCustomUserAgent />
    </>
  );
};

export default DialogDevelopers;
