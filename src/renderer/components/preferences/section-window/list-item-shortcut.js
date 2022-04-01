/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Box } from '@mui/material';

import { useSelector } from 'react-redux';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import keyboardMap from '../../../constants/keyboard-map';

import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../../senders';

const renderCombinator = (combinator) => combinator
  .replace(/\+/g, ' + ')
  .replace('alt', window.process.platform !== 'darwin' ? 'alt' : '⌥')
  .replace('shift', window.process.platform !== 'darwin' ? 'shift' : '⇧')
  .replace('mod', window.process.platform !== 'darwin' ? 'ctrl' : '⌘')
  .replace('meta', '⌘')
  .toUpperCase();

const ListItemShortcut = () => {
  const windowShortcut = useSelector((state) => state.preferences.windowShortcut);

  const [open, setOpen] = useState(false);
  const [combinator, setCombinator] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      const pressed = [];

      if (e.ctrlKey) pressed.push('ctrl');
      if (e.metaKey) pressed.push('meta');
      if (e.altKey) pressed.push('alt');
      if (e.shiftKey) pressed.push('shift');

      const modifier = keyboardMap[e.keyCode];
      if (modifier && ['SHIFT', 'OS_KEY', 'CONTROL', 'ALT'].indexOf(modifier) < 0) {
        pressed.push(modifier.toLowerCase());
      }

      if (pressed.length < 2) return;

      setCombinator(pressed.join('+'));
    };
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, [setCombinator]);

  const dialogComponent = (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        Define a keyboard shortcut to open the app quickly
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Type the new keyboard combination (e.g. SHIFT+D or ALT+SHIFT+O)
        </DialogContentText>
        <DialogContentText sx={{ mt: 1.5 }}>
          {combinator && combinator !== '+' && combinator.split('+').map((key, i) => (
            <Box key={key} component="span">
              {i > 0
              && <Box component="span" sx={{ px: 1.5 }}>+</Box>}
              <Button
                variant="contained"
                color="inherit"
                sx={{
                  ':hover': {
                    bgcolor: 'rgb(0 0 0 / 16%)',
                  },
                }}
              >
                {renderCombinator(key)}
              </Button>
            </Box>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="inherit"
          sx={{
            ':hover': {
              bgcolor: 'rgb(0 0 0 / 16%)',
            },
          }}
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="inherit"
          sx={{
            ':hover': {
              bgcolor: 'rgb(0 0 0 / 16%)',
            },
          }}
          onClick={() => {
            requestSetPreference('windowShortcut', null);
            setOpen(false);
          }}
        >
          Remove Shortcut
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            requestSetPreference('windowShortcut', combinator);
            setOpen(false);
            enqueueRequestRestartSnackbar();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      {dialogComponent}
      <ListItem
        button
        onClick={() => {
          setCombinator(windowShortcut);
          setOpen(true);
        }}
      >
        <ListItemText
          primary="Define a keyboard shortcut to switch to the app window quickly"
          secondary={windowShortcut
            ? renderCombinator(windowShortcut) : null}
        />
        <ChevronRightIcon color="action" />
      </ListItem>
    </>
  );
};

export default ListItemShortcut;
