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

import {
  enqueueRequestRestartSnackbar,
  requestSetPreference,
} from '../../../senders';

import { open as openDialogSpellcheckLanguages } from '../../../state/dialog-spellcheck-languages/actions';

import hunspellLanguagesMap from '../../../constants/hunspell-languages';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
});

const SectionLanguages = ({
  classes,
  spellcheck,
  spellcheckLanguages,
  onOpenDialogSpellcheckLanguages,
}) => (
  <Paper elevation={0} className={classes.paper}>
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
  </Paper>
);

SectionLanguages.propTypes = {
  classes: PropTypes.object.isRequired,
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
  SectionLanguages,
  mapStateToProps,
  actionCreators,
  styles,
);
