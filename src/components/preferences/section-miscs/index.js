/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';
import isMas from '../../../helpers/is-mas';
import isStandalone from '../../../helpers/is-standalone';
import getStaticGlobal from '../../../helpers/get-static-global';
import getUtmSource from '../../../helpers/get-utm-source';

import {
  requestOpenInBrowser,
  requestQuit,
  requestSetPreference,
  requestShowAboutWindow,
  requestShowOpenSourceNoticesWindow,
} from '../../../senders';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const SectionMiscs = ({
  classes,
  warnBeforeQuitting,
}) => {
  const appJson = getStaticGlobal('appJson');
  const utmSource = getUtmSource();

  return (
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
  );
};

SectionMiscs.propTypes = {
  classes: PropTypes.object.isRequired,
  warnBeforeQuitting: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  warnBeforeQuitting: state.preferences.warnBeforeQuitting,
});

export default connectComponent(
  SectionMiscs,
  mapStateToProps,
  null,
  styles,
);
