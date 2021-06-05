/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Color from 'color';

import * as materialColors from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';

import CheckIcon from '@material-ui/icons/Check';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';
import getMailtoUrl from '../../helpers/get-mailto-url';

import {
  getIconFromInternet,
  getIconFromAppSearch,
  save,
  updateForm,
} from '../../state/dialog-add-workspace/actions';

import defaultWorkspaceImageLight from '../../images/default-workspace-image-light.png';
import defaultWorkspaceImageDark from '../../images/default-workspace-image-dark.png';

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
    paddingRight: theme.spacing(4),
  },
  avatarRight: {
    flex: 1,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingRight: 0,
  },
  avatarContainer: {
    position: 'relative',
    '&:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  avatar: {
    fontFamily: theme.typography.fontFamily,
    height: 36,
    width: 36,
    background: theme.palette.common.white,
    borderRadius: 4,
    color: theme.palette.getContrastText(theme.palette.common.white),
    fontSize: '24px',
    lineHeight: '36px',
    textAlign: 'center',
    fontWeight: 400,
    textTransform: 'uppercase',
    userSelect: 'none',
    boxShadow: theme.palette.type === 'dark' ? 'none' : '0 0 1px 1px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    cursor: 'pointer',
  },
  avatarSelected: {
    boxShadow: `0 0 4px 4px ${theme.palette.primary.main}`,
  },
  avatarSelectedBadgeContent: {
    background: theme.palette.primary.main,
    borderRadius: 12,
    width: 24,
    height: 24,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    color: theme.palette.common.white,
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
  textAvatar: {
    background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    color: theme.palette.getContrastText(theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
  },
  buttonBot: {
    marginTop: theme.spacing(1),
  },
  caption: {
    display: 'block',
  },
  colorPickerRow: {
    paddingBottom: theme.spacing(1),
  },
  colorPicker: {
    height: 24,
    width: 24,
    borderRadius: 12,
    marginRight: theme.spacing(1),
    cursor: 'pointer',
    outline: 'none',
    display: 'inline-block',
  },
  colorPickerSelected: {
    boxShadow: `0 0 2px 2px ${theme.palette.primary.main}`,
  },
});

const AddWorkspaceCustom = ({
  backgroundColor,
  classes,
  downloadingIcon,
  homeUrl,
  homeUrlError,
  internetIcon,
  isMailApp,
  name,
  nameError,
  onGetIconFromInternet,
  onGetIconFromAppSearch,
  onSave,
  onUpdateForm,
  picturePath,
  preferredIconType,
  shouldUseDarkColors,
  transparentBackground,
}) => {
  let selectedIconType = 'text';
  if (((picturePath || internetIcon) && preferredIconType === 'auto') || (preferredIconType === 'image')) {
    selectedIconType = 'image';
  }

  const renderAvatar = (avatarContent, type, title = null, avatarAdditionalClassnames = []) => (
    <div className={classes.avatarContainer} title={title}>
      {selectedIconType === type ? (
        <Badge
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={(
            <div className={classes.avatarSelectedBadgeContent}>
              <CheckIcon fontSize="inherit" />
            </div>
          )}
        >
          <div
            className={classnames(
              classes.avatar,
              transparentBackground && classes.transparentAvatar,
              classes.avatarSelected,
              ...avatarAdditionalClassnames,
            )}
            style={(() => {
              if (type === 'text' && backgroundColor && !transparentBackground) {
                return {
                  backgroundColor,
                  color: Color(backgroundColor).isDark() ? '#fff' : '#000',
                };
              }
              return null;
            })()}
          >
            {avatarContent}
          </div>
        </Badge>
      ) : (
        <div
          role="button"
          tabIndex={0}
          className={classnames(
            classes.avatar,
            transparentBackground && classes.transparentAvatar,
            ...avatarAdditionalClassnames,
          )}
          onClick={() => onUpdateForm({ preferredIconType: type })}
          onKeyDown={() => onUpdateForm({ preferredIconType: type })}
        >
          {avatarContent}
        </div>
      )}
    </div>
  );

  return (
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
            {renderAvatar(
              getAvatarText(null, name, null),
              'text',
              'Text',
              [classes.textAvatar],
            )}
            {renderAvatar(
              <img
                alt="Icon"
                className={classes.avatarPicture}
                src={(() => {
                  if (picturePath) return `file://${picturePath}`;
                  if (internetIcon) return internetIcon;
                  return shouldUseDarkColors
                    ? defaultWorkspaceImageLight : defaultWorkspaceImageDark;
                })()}
              />,
              'image',
              'Image',
            )}
          </div>
          <div className={classes.avatarRight}>
            {selectedIconType === 'text' && (
              <>
                <div className={classes.colorPickerRow}>
                  <div
                    className={classnames(
                      classes.colorPicker,
                      backgroundColor == null && classes.colorPickerSelected,
                    )}
                    title="default"
                    style={{ backgroundColor: shouldUseDarkColors ? '#fff' : '#000' }}
                    aria-label="default"
                    role="button"
                    tabIndex={0}
                    onClick={() => onUpdateForm({
                      backgroundColor: null,
                    })}
                    onKeyDown={() => onUpdateForm({
                      backgroundColor: null,
                    })}
                  />
                  {backgroundColor != null && (
                    <div
                      className={classnames(
                        classes.colorPicker,
                        classes.colorPickerSelected,
                      )}
                      title="default"
                      style={{ backgroundColor }}
                      aria-label="default"
                      role="button"
                      tabIndex={0}
                      onClick={() => onUpdateForm({
                        backgroundColor,
                      })}
                      onKeyDown={() => onUpdateForm({
                        backgroundColor,
                      })}
                    />
                  )}
                </div>
                <div className={classes.colorPickerRow}>
                  {Object.keys(materialColors).map((colorId) => {
                    const colorScales = materialColors[colorId];
                    if (!colorScales[500]) return null;
                    return (
                      <div
                        key={colorId}
                        title={colorId}
                        className={classnames(
                          classes.colorPicker,
                          backgroundColor === colorScales[500] && classes.colorPickerSelected,
                        )}
                        style={{ backgroundColor: materialColors[colorId][500] }}
                        aria-label={colorId}
                        role="button"
                        tabIndex={0}
                        onClick={() => onUpdateForm({
                          backgroundColor: materialColors[colorId][500],
                        })}
                        onKeyDown={() => onUpdateForm({
                          backgroundColor: materialColors[colorId][500],
                        })}
                      />
                    );
                  })}
                </div>
              </>
            )}
            {selectedIconType === 'image' && (
              <>
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
                        if (!canceled && filePaths && filePaths.length > 0) {
                          onUpdateForm({
                            preferredIconType: 'image',
                            picturePath: filePaths[0],
                          });
                        }
                      })
                      .catch(console.log); // eslint-disable-line
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
                  onClick={() => onGetIconFromInternet(true)}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.buttonBot}
                  disabled={Boolean(!homeUrl || homeUrlError || downloadingIcon)}
                  onClick={() => onGetIconFromAppSearch(true)}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from Our Database'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.buttonBot}
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => onUpdateForm({
                    picturePath: null,
                    internetIcon: null,
                  })}
                >
                  Reset to Default
                </Button>
              </>
            )}
          </div>
        </div>
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
      <div>
        <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={onSave}>
          Add
        </Button>
      </div>
    </div>
  );
};

AddWorkspaceCustom.defaultProps = {
  backgroundColor: null,
  homeUrl: '',
  homeUrlError: null,
  internetIcon: null,
  name: '',
  nameError: null,
  picturePath: null,
  preferredIconType: 'auto',
};

AddWorkspaceCustom.propTypes = {
  backgroundColor: PropTypes.string,
  classes: PropTypes.object.isRequired,
  downloadingIcon: PropTypes.bool.isRequired,
  homeUrl: PropTypes.string,
  homeUrlError: PropTypes.string,
  internetIcon: PropTypes.string,
  isMailApp: PropTypes.bool.isRequired,
  name: PropTypes.string,
  nameError: PropTypes.string,
  onGetIconFromInternet: PropTypes.func.isRequired,
  onGetIconFromAppSearch: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  picturePath: PropTypes.string,
  preferredIconType: PropTypes.oneOf(['auto', 'text', 'image', 'accountInfo']),
  shouldUseDarkColors: PropTypes.bool.isRequired,
  transparentBackground: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  backgroundColor: state.dialogAddWorkspace.form.backgroundColor,
  downloadingIcon: state.dialogAddWorkspace.downloadingIcon,
  homeUrl: state.dialogAddWorkspace.form.homeUrl,
  homeUrlError: state.dialogAddWorkspace.form.homeUrlError,
  internetIcon: state.dialogAddWorkspace.form.internetIcon,
  isMailApp: Boolean(getMailtoUrl(state.dialogAddWorkspace.form.homeUrl)),
  name: state.dialogAddWorkspace.form.name,
  nameError: state.dialogAddWorkspace.form.nameError,
  picturePath: state.dialogAddWorkspace.form.picturePath,
  preferredIconType: state.dialogAddWorkspace.form.preferredIconType,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
  transparentBackground: Boolean(state.dialogAddWorkspace.form.transparentBackground),
});

const actionCreators = {
  getIconFromInternet,
  getIconFromAppSearch,
  save,
  updateForm,
};

export default connectComponent(
  AddWorkspaceCustom,
  mapStateToProps,
  actionCreators,
  styles,
);
