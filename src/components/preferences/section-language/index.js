/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';

import { useDispatch, useSelector } from 'react-redux';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogSpellcheckLanguages } from '../../../state/dialog-spellcheck-languages/actions';

import hunspellLanguagesMap from '../../../constants/hunspell-languages';

import DialogSpellcheckLanguages from './dialog-spellcheck-languages';

const SectionLanguage = () => {
  const dispatch = useDispatch();

  const spellcheck = useSelector((state) => state.preferences.spellcheck);
  const spellcheckLanguages = useSelector((state) => state.preferences.spellcheckLanguages);

  return (
    <>
      <List disablePadding dense>
        <ListItem>
          <ListItemText primary="Spell check" />
          <ListItemSecondaryAction>
            <Switch
              edge="end"
              color="primary"
              checked={spellcheck}
              onChange={(e) => {
                requestSetPreference('spellcheck', e.target.checked);
                enqueueRequestRestartSnackbar();
              }}
            />
          </ListItemSecondaryAction>
        </ListItem>
        {window.process.platform !== 'darwin' && (
          <>
            <Divider />
            <ListItem button onClick={dispatch(openDialogSpellcheckLanguages)}>
              <ListItemText
                primary="Spell checking languages"
                secondary={spellcheckLanguages.map((code) => hunspellLanguagesMap[code]).join(' | ')}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
          </>
        )}
      </List>
      <DialogSpellcheckLanguages />
    </>
  );
};

export default SectionLanguage;
