/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';

import { getFontListAsync } from '../../invokers';

import { close, updateForm, save } from '../../state/dialog-customize-fonts/actions';

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
    width: 'calc(100% - 100px)',
  },
});

const DialogCustomizeFonts = ({
  classes,
  defaultFontFamilyMonospace,
  defaultFontFamilySansSerif,
  defaultFontFamilySerif,
  defaultFontFamilyStandard,
  defaultFontSize,
  defaultFontSizeMinimum,
  onClose,
  onSave,
  onUpdateForm,
  open,
}) => {
  const [fontList, setFontList] = useState([]);
  useEffect(() => {
    if (open && fontList.length < 1) {
      getFontListAsync()
        .then((newFontList) => {
          setFontList(newFontList);
        })
        // eslint-disable-next-line no-console
        .catch(console.log);
    }
  }, [open, fontList]);

  return (
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
                { value: 9, label: 'Tiny' },
                { value: 16, label: 'Medium' },
                { value: 72, label: 'Huge' },
              ]}
              valueLabelDisplay="auto"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Font size"
            />
            <Slider
              className={classes.slider}
              value={defaultFontSizeMinimum}
              onChange={(e, value) => onUpdateForm({ defaultFontSizeMinimum: value })}
              min={0}
              max={24}
              marks={[
                { value: 0, label: 'Tiny' },
                { value: 24, label: 'Huge' },
              ]}
              valueLabelDisplay="auto"
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Standard font"
            />
            <Select
              value={defaultFontFamilyStandard}
              onChange={(e) => onUpdateForm({ defaultFontFamilyStandard: e.target.value })}
              variant="filled"
              disableUnderline
              margin="dense"
              classes={{
                root: classes.select,
              }}
              className={classes.selectRoot}
            >
              {fontList.map((fontName) => (
                <MenuItem
                  key={fontName}
                  value={fontName}
                  dense
                >
                  {fontName}
                </MenuItem>
              ))}
              {fontList.indexOf(defaultFontFamilyStandard) < 0 && (
                <MenuItem
                  value={defaultFontFamilyStandard}
                  dense
                >
                  Custom
                </MenuItem>
              )}
            </Select>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Serif font"
            />
            <Select
              value={defaultFontFamilySerif}
              onChange={(e) => onUpdateForm({ defaultFontFamilySerif: e.target.value })}
              variant="filled"
              disableUnderline
              margin="dense"
              classes={{
                root: classes.select,
              }}
              className={classes.selectRoot}
            >
              {fontList.map((fontName) => (
                <MenuItem
                  key={fontName}
                  value={fontName}
                  dense
                >
                  {fontName}
                </MenuItem>
              ))}
              {fontList.indexOf(defaultFontFamilySerif) < 0 && (
                <MenuItem
                  value={defaultFontFamilySerif}
                  dense
                >
                  Custom
                </MenuItem>
              )}
            </Select>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Sans-serif font"
            />
            <Select
              value={defaultFontFamilySansSerif}
              onChange={(e) => onUpdateForm({ defaultFontFamilySansSerif: e.target.value })}
              variant="filled"
              disableUnderline
              margin="dense"
              classes={{
                root: classes.select,
              }}
              className={classes.selectRoot}
            >
              {fontList.map((fontName) => (
                <MenuItem
                  key={fontName}
                  value={fontName}
                  dense
                >
                  {fontName}
                </MenuItem>
              ))}
              {fontList.indexOf(defaultFontFamilySansSerif) < 0 && (
                <MenuItem
                  value={defaultFontFamilySansSerif}
                  dense
                >
                  Custom
                </MenuItem>
              )}
            </Select>
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Fixed-width (monospace) font"
            />
            <Select
              value={defaultFontFamilyMonospace}
              onChange={(e) => onUpdateForm({ defaultFontFamilyMonospace: e.target.value })}
              variant="filled"
              disableUnderline
              margin="dense"
              classes={{
                root: classes.select,
              }}
              className={classes.selectRoot}
            >
              {fontList.map((fontName) => (
                <MenuItem
                  key={fontName}
                  value={fontName}
                  dense
                >
                  {fontName}
                </MenuItem>
              ))}
              {fontList.indexOf(defaultFontFamilyMonospace) < 0 && (
                <MenuItem
                  value={defaultFontFamilyMonospace}
                  dense
                >
                  Custom
                </MenuItem>
              )}
            </Select>
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
};

DialogCustomizeFonts.defaultProps = {
  open: false,
  defaultFontFamilyStandard: 'Times',
  defaultFontFamilySerif: 'Times',
  defaultFontFamilySansSerif: 'Helvetica',
  defaultFontFamilyMonospace: 'Courier',
  defaultFontSize: 16,
  defaultFontSizeMinimum: 0,
};

DialogCustomizeFonts.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultFontFamilyMonospace: PropTypes.string,
  defaultFontFamilySansSerif: PropTypes.string,
  defaultFontFamilySerif: PropTypes.string,
  defaultFontFamilyStandard: PropTypes.string,
  defaultFontSize: PropTypes.number,
  defaultFontSizeMinimum: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  open: state.dialogCustomizeFonts.open,
  defaultFontFamilyMonospace: state.dialogCustomizeFonts.form.defaultFontFamilyMonospace,
  defaultFontFamilySansSerif: state.dialogCustomizeFonts.form.defaultFontFamilySansSerif,
  defaultFontFamilySerif: state.dialogCustomizeFonts.form.defaultFontFamilySerif,
  defaultFontFamilyStandard: state.dialogCustomizeFonts.form.defaultFontFamilyStandard,
  defaultFontSize: state.dialogCustomizeFonts.form.defaultFontSize,
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
