/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Slider from '@mui/material/Slider';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import makeStyles from '@mui/styles/makeStyles';

import { useDispatch, useSelector } from 'react-redux';

import { close, updateForm, save } from '../../../state/dialog-customize-fonts/actions';

const useStyles = makeStyles((theme) => ({
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
}));

const DialogCustomizeFonts = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogCustomizeFonts.open);
  const defaultFontSize = useSelector((state) => state.dialogCustomizeFonts.form.defaultFontSize);
  const defaultFontSizeMonospace = useSelector(
    (state) => state.dialogCustomizeFonts.form.defaultFontSizeMonospace,
  );
  const defaultFontSizeMinimum = useSelector(
    (state) => state.dialogCustomizeFonts.form.defaultFontSizeMinimum,
  );

  return (
    <Dialog
      onClose={() => dispatch(close())}
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
              onChange={(e, value) => dispatch(updateForm({ defaultFontSize: value }))}
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
              onChange={(e, value) => dispatch(updateForm({ defaultFontSizeMinimum: value }))}
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
              onChange={(e, value) => dispatch(updateForm({ defaultFontSizeMonospace: value }))}
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

export default DialogCustomizeFonts;
