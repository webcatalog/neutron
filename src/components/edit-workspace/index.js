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
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';

import CheckIcon from '@material-ui/icons/Check';

import connectComponent from '../../helpers/connect-component';
import getAvatarText from '../../helpers/get-avatar-text';
import getMailtoUrl from '../../helpers/get-mailto-url';
import getWebcalUrl from '../../helpers/get-webcal-url';
import getStaticGlobal from '../../helpers/get-static-global';
import getWorkspaceFriendlyName from '../../helpers/get-workspace-friendly-name';

import {
  getIconFromInternet,
  getIconFromAppSearch,
  updateForm,
  save,
} from '../../state/dialog-edit-workspace/actions';

import {
  requestShowWorkspacePreferencesWindow,
} from '../../senders';

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
  textAvatar: {
    background: theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black,
    color: theme.palette.getContrastText(theme.palette.type === 'dark' ? theme.palette.common.white : theme.palette.common.black),
  },
  transparentAvatar: {
    background: 'transparent',
    border: 'none',
    borderRadius: 0,
    color: theme.palette.text.primary,
  },
  avatarPicture: {
    height: 36,
    width: 36,
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

const EditWorkspace = ({
  accountInfo,
  backgroundColor,
  classes,
  disableAudio,
  disableNotifications,
  downloadingIcon,
  hibernateWhenUnused,
  homeUrl,
  homeUrlError,
  id,
  internetIcon,
  isMailApp,
  isCalendarApp,
  name,
  onGetIconFromInternet,
  onGetIconFromAppSearch,
  onSave,
  onUpdateForm,
  order,
  picturePath,
  preferredIconType,
  shouldUseDarkColors,
  transparentBackground,
}) => {
  const appJson = getStaticGlobal('appJson');

  let namePlaceholder = 'Optional';
  if (accountInfo) {
    if (accountInfo.name && accountInfo.email) {
      namePlaceholder = `${accountInfo.name} (${accountInfo.email})`;
    } else if (accountInfo.name) {
      namePlaceholder = accountInfo.name;
    }
  }

  let selectedIconType = 'text';
  if (((picturePath || internetIcon) && preferredIconType === 'auto') || (preferredIconType === 'image')) {
    selectedIconType = 'image';
  } else if (accountInfo && accountInfo.picturePath && (preferredIconType === 'auto' || preferredIconType === 'accountInfo')) {
    selectedIconType = 'accountInfo';
  }

  const finalName = (() => {
    if (accountInfo) {
      if (accountInfo.name && accountInfo.email) {
        return `${accountInfo.name} (${accountInfo.email})`;
      }
      if (accountInfo.name) {
        return accountInfo.name;
      }
    }
    return name;
  })();

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
      <div className={classes.flexGrow}>
        <TextField
          label="Name"
          placeholder={namePlaceholder}
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
          placeholder="Optional"
          fullWidth
          margin="dense"
          variant="outlined"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          value={homeUrl}
          onChange={(e) => onUpdateForm({ homeUrl: e.target.value })}
          helperText={(() => {
            if (!homeUrlError && isMailApp) {
              return 'Email app detected.';
            }
            if (!homeUrlError && isCalendarApp) {
              return 'Calendar app detected.';
            }
            if (!homeUrl && appJson.url) {
              return `Defaults to ${appJson.url}.`;
            }
            return homeUrlError;
          })()}
        />
        <div className={classes.avatarFlex}>
          <div className={classes.avatarLeft}>
            {renderAvatar(
              getAvatarText(id, finalName, order),
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
            {(accountInfo && accountInfo.picturePath) && renderAvatar(
              <img alt="Icon" className={classes.avatarPicture} src={`file://${accountInfo.picturePath}`} />,
              'accountInfo',
              'Account\'s Picture',
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
                  disabled={Boolean(homeUrlError || downloadingIcon)}
                  onClick={() => onGetIconFromInternet(true)}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.buttonBot}
                  disabled={Boolean(homeUrlError || downloadingIcon)}
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
        <List>
          <Divider />
          <ListItem disableGutters>
            <ListItemText primary="Hibernate when not used" secondary="Save CPU usage, memory and battery." />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={hibernateWhenUnused}
                onChange={(e) => onUpdateForm({ hibernateWhenUnused: e.target.checked })}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary="Disable notifications" secondary={`Prevent ${getWorkspaceFriendlyName().toLowerCase()} from sending notifications.`} />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={disableNotifications}
                onChange={(e) => onUpdateForm({ disableNotifications: e.target.checked })}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText primary="Disable sound" secondary={`Prevent ${getWorkspaceFriendlyName().toLowerCase()} from playing audio.`} />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                color="primary"
                checked={disableAudio}
                onChange={(e) => onUpdateForm({ disableAudio: e.target.checked })}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </div>
      <div>
        <Button variant="contained" disableElevation onClick={() => requestShowWorkspacePreferencesWindow(id)}>
          Show Advanced Settings
        </Button>
        <Button color="primary" variant="contained" className={classes.button} onClick={onSave}>
          Save
        </Button>
      </div>
    </div>
  );
};

EditWorkspace.defaultProps = {
  accountInfo: null,
  backgroundColor: null,
  homeUrlError: null,
  internetIcon: null,
  picturePath: null,
  preferredIconType: 'auto',
};

EditWorkspace.propTypes = {
  accountInfo: PropTypes.object,
  backgroundColor: PropTypes.string,
  classes: PropTypes.object.isRequired,
  disableAudio: PropTypes.bool.isRequired,
  disableNotifications: PropTypes.bool.isRequired,
  downloadingIcon: PropTypes.bool.isRequired,
  hibernateWhenUnused: PropTypes.bool.isRequired,
  homeUrl: PropTypes.string.isRequired,
  homeUrlError: PropTypes.string,
  id: PropTypes.string.isRequired,
  internetIcon: PropTypes.string,
  isMailApp: PropTypes.bool.isRequired,
  isCalendarApp: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onGetIconFromInternet: PropTypes.func.isRequired,
  onGetIconFromAppSearch: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  order: PropTypes.number.isRequired,
  picturePath: PropTypes.string,
  preferredIconType: PropTypes.oneOf(['auto', 'text', 'image', 'accountInfo']),
  shouldUseDarkColors: PropTypes.bool.isRequired,
  transparentBackground: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  accountInfo: state.dialogEditWorkspace.form.accountInfo,
  backgroundColor: state.dialogEditWorkspace.form.backgroundColor,
  disableAudio: Boolean(state.dialogEditWorkspace.form.disableAudio),
  disableNotifications: Boolean(state.dialogEditWorkspace.form.disableNotifications),
  downloadingIcon: state.dialogEditWorkspace.downloadingIcon,
  hibernateWhenUnused: Boolean(state.dialogEditWorkspace.form.hibernateWhenUnused),
  homeUrl: state.dialogEditWorkspace.form.homeUrl || '',
  homeUrlError: state.dialogEditWorkspace.form.homeUrlError,
  id: state.dialogEditWorkspace.form.id || '',
  internetIcon: state.dialogEditWorkspace.form.internetIcon,
  isMailApp: Boolean(getMailtoUrl(state.dialogEditWorkspace.form.homeUrl)),
  isCalendarApp: Boolean(getWebcalUrl(state.dialogEditWorkspace.form.homeUrl)),
  name: state.dialogEditWorkspace.form.name || '',
  order: state.dialogEditWorkspace.form.order || 0,
  picturePath: state.dialogEditWorkspace.form.picturePath,
  preferredIconType: state.dialogEditWorkspace.form.preferredIconType,
  shouldUseDarkColors: state.general.shouldUseDarkColors,
  transparentBackground: Boolean(state.dialogEditWorkspace.form.transparentBackground),
});

const actionCreators = {
  getIconFromInternet,
  getIconFromAppSearch,
  updateForm,
  save,
};

export default connectComponent(
  EditWorkspace,
  mapStateToProps,
  actionCreators,
  styles,
);
