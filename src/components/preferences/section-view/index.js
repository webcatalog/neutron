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
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';

import connectComponent from '../../../helpers/connect-component';
import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import isMenubarBrowser from '../../../helpers/is-menubar-browser';

import {
  requestRealignActiveWorkspace,
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../../senders';

const styles = (theme) => ({
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
});

const SectionAppearance = ({
  alwaysOnTop,
  attachToMenubar,
  classes,
  navigationBar,
  sidebar,
  sidebarAddButton,
  sidebarSize,
  sidebarTips,
  titleBar,
  titleBarNavigationButtons,
  windowButtons,
}) => (
  <List disablePadding dense>
    {!isMenubarBrowser() && (
      <>
        <ListItem>
          <ListItemText
            primary={`Show ${getWorkspaceFriendlyName().toLowerCase()} bar`}
            secondary={`${getWorkspaceFriendlyName()} bar lets you switch easily between ${getWorkspaceFriendlyName(true).toLowerCase()}.`}
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={sidebar}
              onChange={(e) => {
                requestSetPreference('sidebar', e.target.checked);
                requestRealignActiveWorkspace();
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`${getWorkspaceFriendlyName()} bar size`}
          />
          <Select
            value={sidebarSize}
            onChange={(e) => {
              requestSetPreference('sidebarSize', e.target.value);
              requestRealignActiveWorkspace();
            }}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classes.selectRoot}
          >
            <MenuItem
              value="compact"
              dense
            >
              Compact
            </MenuItem>
            <MenuItem
              value="expanded"
              dense
            >
              Expanded
            </MenuItem>
          </Select>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Show tips on ${getWorkspaceFriendlyName().toLowerCase()} bar`}
          />
          <Select
            value={sidebarSize === 'expanded' ? 'name+shortcut' : sidebarTips}
            onChange={(e) => requestSetPreference('sidebarTips', e.target.value)}
            variant="filled"
            disableUnderline
            margin="dense"
            classes={{
              root: classes.select,
            }}
            className={classes.selectRoot}
            disabled={sidebarSize === 'expanded'}
          >
            {sidebarSize === 'expanded' && (
            <MenuItem
              value="name+shortcut"
              dense
            >
              {`${getWorkspaceFriendlyName()} names & keyboard shortcuts`}
            </MenuItem>
            )}
            <MenuItem
              value="shortcut"
              dense
            >
              {`${getWorkspaceFriendlyName()} keyboard shortcuts`}
            </MenuItem>
            <MenuItem
              value="name"
              dense
            >
              {`${getWorkspaceFriendlyName()} names`}
            </MenuItem>
            <MenuItem
              value="none"
              dense
            >
              None
            </MenuItem>
          </Select>
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Show add (+) button on ${getWorkspaceFriendlyName().toLowerCase()} bar`}
          />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={sidebarAddButton}
              onChange={(e) => {
                requestSetPreference('sidebarAddButton', e.target.checked);
                requestRealignActiveWorkspace();
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
      </>
    )}
    {window.process.platform === 'darwin' && (
    <>
      {!isMenubarBrowser() && <Divider />}
      <ListItem>
        <ListItemText
          primary="Show title bar"
          secondary="Title bar shows you the title of the current page."
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={titleBar}
            onChange={(e) => {
              requestSetPreference('titleBar', e.target.checked);
              requestRealignActiveWorkspace();
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <ListItemText
          primary="Show navigation buttons on title bar"
        />
        <ListItemSecondaryAction>
          <Switch
            edge="end"
            color="primary"
            checked={navigationBar ? false : titleBarNavigationButtons}
            disabled={navigationBar}
            onChange={(e) => {
              requestSetPreference('titleBarNavigationButtons', e.target.checked);
            }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      {!isMenubarBrowser() && (
        <>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Show window buttons"
              secondary={'Show "traffic light" (red/yellow/green) buttons.'}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={(() => {
                  // if window is attched to menu bar
                  // the buttons are hidden
                  // unless alwaysOnTop is enabled
                  if (attachToMenubar) return alwaysOnTop;
                  return windowButtons;
                })()}
                disabled={attachToMenubar}
                onChange={(e) => {
                  requestSetPreference('windowButtons', e.target.checked);
                  enqueueRequestRestartSnackbar();
                }}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </>
      )}
    </>
    )}
    <Divider />
    <ListItem>
      <ListItemText
        primary="Show navigation bar"
        secondary="Navigation bar lets you see current URL, go back, forward, home and reload."
      />
      <ListItemSecondaryAction>
        <Switch
          edge="end"
          color="primary"
            // must show sidebar or navigation bar on Linux
            // if not, as user can't right-click on menu bar icon
            // they can't access preferences or notifications
          checked={(window.process.platform === 'linux' && attachToMenubar && !sidebar) || navigationBar}
          disabled={(window.process.platform === 'linux' && attachToMenubar && !sidebar)}
          onChange={(e) => {
            requestSetPreference('navigationBar', e.target.checked);
            requestRealignActiveWorkspace();
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  </List>
);

SectionAppearance.propTypes = {
  alwaysOnTop: PropTypes.bool.isRequired,
  attachToMenubar: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  navigationBar: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  sidebarAddButton: PropTypes.bool.isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  sidebarTips: PropTypes.oneOf(['shortcut', 'name', 'none']).isRequired,
  titleBar: PropTypes.bool.isRequired,
  titleBarNavigationButtons: PropTypes.bool.isRequired,
  windowButtons: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  alwaysOnTop: state.preferences.alwaysOnTop,
  attachToMenubar: state.preferences.attachToMenubar,
  navigationBar: state.preferences.navigationBar,
  sidebar: state.preferences.sidebar,
  sidebarAddButton: state.preferences.sidebarAddButton,
  sidebarSize: state.preferences.sidebarSize,
  sidebarTips: state.preferences.sidebarTips,
  titleBar: state.preferences.titleBar,
  titleBarNavigationButtons: state.preferences.titleBarNavigationButtons,
  windowButtons: state.preferences.windowButtons,
});

export default connectComponent(
  SectionAppearance,
  mapStateToProps,
  null,
  styles,
);
