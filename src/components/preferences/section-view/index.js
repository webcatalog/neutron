/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import getWorkspaceFriendlyName from '../../../helpers/get-workspace-friendly-name';
import isMenubarBrowser from '../../../helpers/is-menubar-browser';

import {
  requestRealignActiveWorkspace,
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../../senders';

const SectionAppearance = () => {
  const alwaysOnTop = useSelector((state) => state.preferences.alwaysOnTop);
  const attachToMenubar = useSelector((state) => state.preferences.attachToMenubar);
  const navigationBar = useSelector((state) => state.preferences.navigationBar);
  const sidebar = useSelector((state) => state.preferences.sidebar);
  const sidebarAddButton = useSelector((state) => state.preferences.sidebarAddButton);
  const sidebarSize = useSelector((state) => state.preferences.sidebarSize);
  const sidebarTips = useSelector((state) => state.preferences.sidebarTips);
  const titleBar = useSelector((state) => state.preferences.titleBar);
  const titleBarNavigationButtons = useSelector(
    (state) => state.preferences.titleBarNavigationButtons,
  );
  const windowButtons = useSelector((state) => state.preferences.windowButtons);

  return (
    <List disablePadding dense>
      {!isMenubarBrowser() && (
        <Box>
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
              sx={{
                borderRadius: 0.5,
                fontSize: '0.84375rem',
                my: 1,
                '& .MuiSelect-select': {
                  py: 1,
                  pr: 3.25,
                  pl: 1.5,
                },
              }}
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
              sx={{
                borderRadius: 0.5,
                fontSize: '0.84375rem',
                my: 1,
                '& .MuiSelect-select': {
                  py: 1,
                  pr: 3.25,
                  pl: 1.5,
                },
              }}
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
        </Box>
      )}
      {window.process.platform === 'darwin' && (
      <Box>
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
      </Box>
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
};

export default SectionAppearance;
