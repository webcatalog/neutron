/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';
import getMailtoUrl from '../../helpers/get-mailto-url';
import isUrl from '../../helpers/is-url';

import {
  getIconFromInternet,
  save,
  updateForm,
} from '../../state/dialog-add-workspace/actions';

const styles = (theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  flexGrow: {
    flex: 1,
  },
  button: {
    float: 'right',
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  avatarFlex: {
    display: 'flex',
  },
  avatarLeft: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: 0,
    paddingRight: theme.spacing(1),
  },
  avatarRight: {
    flex: 1,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: 0,
  },
  avatar: {
    fontFamily: theme.typography.fontFamily,
    height: 64,
    width: 64,
    background: theme.palette.common.white,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.common.white),
    fontSize: '32px',
    lineHeight: '64px',
    textAlign: 'center',
    fontWeight: 500,
    textTransform: 'uppercase',
    userSelect: 'none',
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
  },
  transparentAvatar: {
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
  },
  avatarPicture: {
    height: '100%',
    width: '100%',
  },
  buttonBot: {
    marginTop: theme.spacing(1),
  },
  caption: {
    display: 'block',
  },
});

const getValidIconPath = (iconPath, internetIcon) => {
  if (iconPath) {
    if (isUrl(iconPath)) return iconPath;
    return `file://${iconPath}`;
  }
  return internetIcon;
};

const AddWorkspaceCustom = ({
  classes,
  downloadingIcon,
  homeUrl,
  homeUrlError,
  internetIcon,
  isMailApp,
  name,
  nameError,
  onGetIconFromInternet,
  onSave,
  onUpdateForm,
  picturePath,
  transparentBackground,
}) => (
  <div className={classes.root}>
    <div>
      <TextField
        label="Name"
        error={Boolean(nameError)}
        placeholder="Example"
        helperText={nameError}
        fullWidth
        margin="dense"
        variant="outlined"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={name}
        onChange={(e) => onUpdateForm({ name: e.target.value })}
      />
      <TextField
        label="Home URL"
        error={Boolean(homeUrlError)}
        placeholder="https://example.com"
        helperText={homeUrlError || (isMailApp && 'Email app detected.')}
        fullWidth
        margin="dense"
        variant="outlined"
        className={classes.textField}
        InputLabelProps={{
          shrink: true,
        }}
        value={homeUrl}
        onChange={(e) => onUpdateForm({ homeUrl: e.target.value })}
      />
      <div className={classes.avatarFlex}>
        <div className={classes.avatarLeft}>
          <div
            className={classnames(
              classes.avatar,
              transparentBackground && classes.transparentAvatar,
            )}
          >
            {picturePath || internetIcon ? (
              <img alt="Icon" className={classes.avatarPicture} src={getValidIconPath(picturePath, internetIcon)} />
            ) : getAvatarText(null, name, null)}
          </div>
        </div>
        <div className={classes.avatarRight}>
          <Button
            variant="outlined"
            size="small"
            disabled={downloadingIcon}
            onClick={() => {
              const opts = {
                properties: ['openFile'],
                filters: [
                  { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'tiff', 'tif', 'bmp', 'dib'] },
                ],
              };
              window.remote.dialog.showOpenDialog(window.remote.getCurrentWindow(), opts)
                .then(({ canceled, filePaths }) => {
                  if (!canceled && filePaths.length > 0) {
                    onUpdateForm({ picturePath: filePaths[0] });
                  }
                });
            }}
          >
            Select Local Image...
          </Button>
          <Typography variant="caption" className={classes.caption}>
            PNG, JPEG, GIF, TIFF or BMP.
          </Typography>
          <Button
            variant="outlined"
            size="small"
            className={classes.buttonBot}
            disabled={Boolean(!homeUrl || homeUrlError || downloadingIcon)}
            onClick={() => onGetIconFromInternet()}
          >
            {downloadingIcon ? 'Downloading Icon...' : 'Download Icon from the Internet'}
          </Button>
          <br />
          <Button
            variant="outlined"
            size="small"
            className={classes.buttonBot}
            onClick={() => onUpdateForm({ picturePath: null, internetIcon: null })}
            disabled={!(picturePath || internetIcon) || downloadingIcon}
          >
            Reset to Default
          </Button>
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={transparentBackground}
                  onChange={(e) => onUpdateForm({ transparentBackground: e.target.checked })}
                />
              )}
              label="Use transparent background"
            />
          </FormGroup>
        </div>
      </div>
    </div>
    <div>
      <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={onSave}>
        Add
      </Button>
    </div>
  </div>
);

AddWorkspaceCustom.defaultProps = {
  homeUrl: '',
  homeUrlError: null,
  internetIcon: null,
  name: '',
  nameError: null,
  picturePath: null,
};

AddWorkspaceCustom.propTypes = {
  classes: PropTypes.object.isRequired,
  downloadingIcon: PropTypes.bool.isRequired,
  homeUrl: PropTypes.string,
  homeUrlError: PropTypes.string,
  internetIcon: PropTypes.string,
  isMailApp: PropTypes.bool.isRequired,
  name: PropTypes.string,
  nameError: PropTypes.string,
  onGetIconFromInternet: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  picturePath: PropTypes.string,
  transparentBackground: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  downloadingIcon: state.dialogAddWorkspace.downloadingIcon,
  homeUrl: state.dialogAddWorkspace.form.homeUrl,
  homeUrlError: state.dialogAddWorkspace.form.homeUrlError,
  internetIcon: state.dialogAddWorkspace.form.internetIcon,
  isMailApp: Boolean(getMailtoUrl(state.dialogAddWorkspace.form.homeUrl)),
  name: state.dialogAddWorkspace.form.name,
  nameError: state.dialogAddWorkspace.form.nameError,
  picturePath: state.dialogAddWorkspace.form.picturePath,
  transparentBackground: Boolean(state.dialogAddWorkspace.form.transparentBackground),
});

const actionCreators = {
  getIconFromInternet,
  save,
  updateForm,
};

export default connectComponent(
  AddWorkspaceCustom,
  mapStateToProps,
  actionCreators,
  styles,
);
