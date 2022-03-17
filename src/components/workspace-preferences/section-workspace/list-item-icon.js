/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import classnames from 'classnames';
import Color from 'color';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Badge from '@material-ui/core/Badge';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core';

import { useSelector, useDispatch } from 'react-redux';

import CheckIcon from '@material-ui/icons/Check';

import getAvatarText from '../../../helpers/get-avatar-text';
import isUrl from '../../../helpers/is-url';
import getPicturePath from '../../../helpers/get-picture-path';
import isMenubarBrowser from '../../../helpers/is-menubar-browser';

import themeColors from '../../../constants/theme-colors';

import {
  updateForm,
  getIconFromInternet,
  getIconFromAppSearch,
  removePicture,
  setPicture,
} from '../../../state/dialog-workspace-preferences/actions';

import defaultWorkspaceImageLight from '../../../images/default-workspace-image-light.png';
import defaultWorkspaceImageDark from '../../../images/default-workspace-image-dark.png';

const useStyles = makeStyles((theme) => ({
  flexGrow: {
    flex: 1,
  },
  button: {
    float: 'right',
  },
  avatarFlex: {
    display: 'flex',
    flexDirection: 'column',
  },
  avatarLeft: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: 0,
    paddingRight: theme.spacing(4),
    display: 'flex',
    flexDirection: 'row',
  },
  avatarRight: {
    flex: 1,
    paddingTop: theme.spacing(2),
    paddingRight: 0,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing(2),
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
}));

const ListItemIcon = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const accountInfo = useSelector((state) => state.dialogWorkspacePreferences.form.accountInfo);
  const color = useSelector((state) => state.dialogWorkspacePreferences.form.preferences.color);
  const downloadingIcon = useSelector((state) => state.dialogWorkspacePreferences.downloadingIcon);
  const id = useSelector((state) => state.dialogWorkspacePreferences.form.id || '');
  const name = useSelector((state) => state.dialogWorkspacePreferences.form.name || '');
  const order = useSelector((state) => state.dialogWorkspacePreferences.form.order || 0);
  const pictureId = useSelector((state) => state.dialogWorkspacePreferences.form.pictureId);
  const imgPath = useSelector((state) => state.dialogWorkspacePreferences.form.imgPath);
  // eslint-disable-next-line max-len
  const preferredIconType = useSelector((state) => state.dialogWorkspacePreferences.form.preferredIconType);
  const shouldUseDarkColors = useSelector((state) => state.general.shouldUseDarkColors);
  // eslint-disable-next-line max-len
  const transparentBackground = useSelector((state) => Boolean(state.dialogWorkspacePreferences.form.transparentBackground));

  let selectedIconType = 'text';
  if ((imgPath && preferredIconType === 'auto') || (pictureId && preferredIconType === 'auto') || (preferredIconType === 'image')) {
    selectedIconType = 'image';
  } else if (accountInfo && accountInfo.pictureId && (preferredIconType === 'auto' || preferredIconType === 'accountInfo')) {
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

  const backgroundColor = color ? themeColors[color][600] : null;

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
              type === 'image' && transparentBackground && classes.transparentAvatar,
              classes.avatarSelected,
              ...avatarAdditionalClassnames,
            )}
            style={(() => {
              if (type === 'text' && backgroundColor) {
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
            type === 'image' && transparentBackground && classes.transparentAvatar,
            ...avatarAdditionalClassnames,
          )}
          style={(() => {
            if (type === 'text' && backgroundColor) {
              return {
                backgroundColor,
                color: Color(backgroundColor).isDark() ? '#fff' : '#000',
              };
            }
            return null;
          })()}
          onClick={() => dispatch(updateForm({ preferredIconType: type }))}
          onKeyDown={() => dispatch(updateForm({ preferredIconType: type }))}
        >
          {avatarContent}
        </div>
      )}
    </div>
  );

  return (
    <ListItem>
      <div className={classes.flexGrow}>
        <div className={classes.avatarFlex}>
          <div className={classes.avatarLeft}>
            {!isMenubarBrowser() && renderAvatar(
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
                  if (imgPath) {
                    if (isUrl(imgPath)) return imgPath;
                    if (imgPath) return `file://${imgPath}`;
                  }
                  if (pictureId) {
                    return `file://${getPicturePath(pictureId)}`;
                  }
                  return shouldUseDarkColors
                    ? defaultWorkspaceImageLight : defaultWorkspaceImageDark;
                })()}
              />,
              'image',
              'Image',
            )}
            {(accountInfo && accountInfo.pictureId) && renderAvatar(
              <img alt="Icon" className={classes.avatarPicture} src={`file://${getPicturePath(accountInfo.pictureId, 'account-pictures')}`} />,
              'accountInfo',
              'Account\'s Picture',
            )}
          </div>
          <div className={classes.avatarRight}>
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
                          dispatch(setPicture(filePaths[0]));
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
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => dispatch(getIconFromInternet(true))}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.buttonBot}
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => dispatch(getIconFromAppSearch(true))}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from Our Database'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.buttonBot}
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => dispatch(removePicture())}
                >
                  Reset to Default
                </Button>
              </>
            )}
          </div>
        </div>
        {selectedIconType === 'image' && !isMenubarBrowser() && (
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={transparentBackground}
                  // eslint-disable-next-line max-len
                  onChange={(e) => dispatch(updateForm({ transparentBackground: e.target.checked }))}
                />
              )}
              label="Use transparent background"
            />
          </FormGroup>
        )}
      </div>
    </ListItem>
  );
};

export default ListItemIcon;
