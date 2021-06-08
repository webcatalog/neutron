/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../../helpers/connect-component';

import hunspellLanguagesMap from '../../../constants/hunspell-languages';

import {
  close,
  addLanguage,
  removeLanguage,
  save,
} from '../../../state/dialog-spellcheck-languages/actions';

const styles = () => ({
  top: {
    flex: 1,
    overflow: 'auto',
  },
});

const DialogSpellcheckLanguages = (props) => {
  const {
    classes,
    onAddLanguage,
    onClose,
    onRemoveLanguage,
    onSave,
    open,
    spellcheckLanguages,
  } = props;

  return (
    <Dialog
      onClose={onClose}
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
                  onRemoveLanguage(code);
                } else {
                  onAddLanguage(code);
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
        <Button variant="contained" disableElevation onClick={onClose}>
          Cancel
        </Button>
        <Button color="primary" variant="contained" disableElevation onClick={onSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogSpellcheckLanguages.defaultProps = {
  open: false,
  spellcheckLanguages: [],
};

DialogSpellcheckLanguages.propTypes = {
  classes: PropTypes.object.isRequired,
  onAddLanguage: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onRemoveLanguage: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool,
  spellcheckLanguages: PropTypes.arrayOf(PropTypes.string),
};

const mapStateToProps = (state) => ({
  open: state.dialogSpellcheckLanguages.open,
  spellcheckLanguages: state.dialogSpellcheckLanguages.form.spellcheckLanguages,
});

const actionCreators = {
  close,
  save,
  addLanguage,
  removeLanguage,
};

export default connectComponent(
  DialogSpellcheckLanguages,
  mapStateToProps,
  actionCreators,
  styles,
);
