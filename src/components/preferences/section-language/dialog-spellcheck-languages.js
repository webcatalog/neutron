/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import hunspellLanguagesMap from '../../../constants/hunspell-languages';

import {
  close,
  addLanguage,
  removeLanguage,
  save,
} from '../../../state/dialog-spellcheck-languages/actions';

const useStyles = makeStyles(() => ({
  top: {
    flex: 1,
    overflow: 'auto',
  },
}));

const DialogSpellcheckLanguages = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogSpellcheckLanguages.open);
  const spellcheckLanguages = useSelector(
    (state) => state.dialogSpellcheckLanguages.form.spellcheckLanguages,
  );

  return (
    <Dialog
      onClose={() => dispatch(close())}
      open={open}
      fullWidth
      maxWidth="xs"
    >
      <DialogContent>
        <List
          disablePadding
          dense
          className={classes.top}
        >
          {Object.keys(hunspellLanguagesMap).map((code) => (
            <ListItem
              dense
              key={code}
              button
              onClick={() => {
                if (spellcheckLanguages.includes(code)) {
                  dispatch(removeLanguage(code));
                } else {
                  dispatch(addLanguage(code));
                }
              }}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={spellcheckLanguages.includes(code)}
                  disabled={spellcheckLanguages.length < 2
                    && spellcheckLanguages.includes(code)}
                />
              </ListItemIcon>
              <ListItemText primary={hunspellLanguagesMap[code]} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" disableElevation onClick={() => dispatch(close())}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" disableElevation onClick={() => dispatch(save())}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogSpellcheckLanguages;
