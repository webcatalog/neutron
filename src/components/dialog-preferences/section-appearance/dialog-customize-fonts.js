/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Slider from '@material-ui/core/Slider';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../../helpers/connect-component';

import { close, updateForm, save } from '../../../state/dialog-customize-fonts/actions';

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
  slider: {
    width: 'calc(100% - 180px)',
  },
});

const DialogCustomizeFonts = ({
  classes,
  defaultFontSize,
  defaultFontSizeMinimum,
  defaultFontSizeMonospace,
  onClose,
  onSave,
  onUpdateForm,
  open,
}) => (
  <Dialog
    onClose={onClose}
    open={open}
    fullWidth
    maxWidth="sm"
  >
    <DialogContent>
      <List dense>
        <ListItem>
          <ListItemText
            primary="Font size"
          />
          <Slider
            className={classes.slider}
            value={defaultFontSize}
            onChange={(e, value) => onUpdateForm({ defaultFontSize: value })}
            min={9}
            max={72}
            marks={[
              { value: 16, label: 'Medium' },
            ]}
            valueLabelDisplay="auto"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Minimum font size"
          />
          <Slider
            className={classes.slider}
            value={defaultFontSizeMinimum}
            onChange={(e, value) => onUpdateForm({ defaultFontSizeMinimum: value })}
            min={0}
            max={24}
            marks={[
              { value: 0, label: 'Default' },
            ]}
            valueLabelDisplay="auto"
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Monospace font size"
          />
          <Slider
            className={classes.slider}
            value={defaultFontSizeMonospace}
            onChange={(e, value) => onUpdateForm({ defaultFontSizeMonospace: value })}
            min={9}
            max={72}
            marks={[
              { value: 13, label: 'Medium' },
            ]}
            valueLabelDisplay="auto"
          />
        </ListItem>
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

DialogCustomizeFonts.defaultProps = {
  open: false,
  defaultFontSize: 16,
  defaultFontSizeMinimum: 0,
  defaultFontSizeMonospace: 13,
};

DialogCustomizeFonts.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultFontSize: PropTypes.number,
  defaultFontSizeMonospace: PropTypes.number,
  defaultFontSizeMinimum: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  open: state.dialogCustomizeFonts.open,
  defaultFontSize: state.dialogCustomizeFonts.form.defaultFontSize,
  defaultFontSizeMonospace: state.dialogCustomizeFonts.form.defaultFontSizeMonospace,
  defaultFontSizeMinimum: state.dialogCustomizeFonts.form.defaultFontSizeMinimum,
});

const actionCreators = {
  close,
  updateForm,
  save,
};

export default connectComponent(
  DialogCustomizeFonts,
  mapStateToProps,
  actionCreators,
  styles,
);
