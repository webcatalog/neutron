/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';

import { useDispatch, useSelector } from 'react-redux';

import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import isWebcatalog from '../../../helpers/is-webcatalog';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import { updateForm } from '../../../state/dialog-workspace-preferences/actions';

import {
  requestOpenInBrowser,
} from '../../../senders';

const useStyles = makeStyles(() => ({
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
}));

const SectionNotifications = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const formDisableNotifications = useSelector(
    (state) => Boolean(state.dialogWorkspacePreferences.form.disableNotifications),
  );

  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();
  return (
    <List disablePadding dense>
      <ListItem>
        <ListItemText
          primary={`Prevent the ${getWorkspaceFriendlyName().toLowerCase()} from sending notifications`}
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={formDisableNotifications}
            onChange={(e) => {
              dispatch(updateForm({
                disableNotifications: e.target.checked,
              }));
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
      <ListItem>
        <ListItemText
          secondary={(
            <>
              {isWebcatalog() ? 'WebCatalog' : appJson.name}
              <span> supports notifications out of the box. </span>
              <span>But for some web apps such as Gmail or Messenger</span>
              <span>, to receive notifications, you&apos;ll need to manually configure </span>
              <span>additional web app settings. </span>
              <span
                role="link"
                tabIndex={0}
                className={classes.link}
                onClick={() => requestOpenInBrowser(`https://docs.webcatalog.io/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`)}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter') return;
                  requestOpenInBrowser(`https://docs.webcatalog.io/article/17-how-to-enable-notifications-in-web-apps?utm_source=${utmSource}`);
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
  );
};

export default SectionNotifications;
