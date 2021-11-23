/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import keyboardMap from '../../../constants/keyboard-map';

import {
  requestSetPreference,
  enqueueRequestRestartSnackbar,
} from '../../../senders';

const styles = {
  combinatorContainer: {
    marginTop: 12,
  },
  plusText: {
    paddingLeft: 12,
    paddingRight: 12,
  },
};

const renderCombinator = (combinator) => combinator
  .replace(/\+/g, ' + ')
  .replace('alt', window.process.platform !== 'darwin' ? 'alt' : '⌥')
  .replace('shift', window.process.platform !== 'darwin' ? 'shift' : '⇧')
  .replace('mod', window.process.platform !== 'darwin' ? 'ctrl' : '⌘')
  .replace('meta', '⌘')
  .toUpperCase();

const ListItemShortcut = ({ classes, windowShortcut }) => {
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
  });

  const dialogComponent = (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>
        Define a keyboard shortcut to open the app quickly
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Type the new keyboard combination (e.g. SHIFT+D or ALT+SHIFT+O)
        </DialogContentText>
        <DialogContentText className={classes.combinatorContainer}>
          {combinator && combinator !== '+' && combinator.split('+').map((key, i) => (
            <span key={key}>
              {i > 0 && <span className={classes.plusText}>+</span>}
              <Button variant="contained">
                {renderCombinator(key)}
              </Button>
            </span>
          ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            requestSetPreference('windowShortcut', null);
            setOpen(false);
          }}
        >
          Remove Shortcut
        </Button>
        <Button
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

ListItemShortcut.defaultProps = {
  windowShortcut: null,
};

ListItemShortcut.propTypes = {
  classes: PropTypes.object.isRequired,
  windowShortcut: PropTypes.string,
};

const mapStateToProps = (state) => ({
  windowShortcut: state.preferences.windowShortcut,
});

export default connectComponent(
  ListItemShortcut,
  mapStateToProps,
  null,
  styles,
);
