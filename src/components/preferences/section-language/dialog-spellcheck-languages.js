/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import makeStyles from '@mui/styles/makeStyles';

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
    (state) => state.dialogSpellcheckLanguages.form.spellcheckLanguages || [],
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
