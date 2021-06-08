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
import Switch from '@material-ui/core/Switch';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import connectComponent from '../../../helpers/connect-component';

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogSpellcheckLanguages } from '../../../state/dialog-spellcheck-languages/actions';

import hunspellLanguagesMap from '../../../constants/hunspell-languages';

import DialogSpellcheckLanguages from './dialog-spellcheck-languages';

const SectionLanguage = ({
  spellcheck,
  spellcheckLanguages,
  onOpenDialogSpellcheckLanguages,
}) => (
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
          <ListItem button onClick={onOpenDialogSpellcheckLanguages}>
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

SectionLanguage.propTypes = {
  onOpenDialogSpellcheckLanguages: PropTypes.func.isRequired,
  spellcheck: PropTypes.bool.isRequired,
  spellcheckLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
};

const mapStateToProps = (state) => ({
  spellcheck: state.preferences.spellcheck,
  spellcheckLanguages: state.preferences.spellcheckLanguages,
});

const actionCreators = {
  openDialogSpellcheckLanguages,
};

export default connectComponent(
  SectionLanguage,
  mapStateToProps,
  actionCreators,
);
