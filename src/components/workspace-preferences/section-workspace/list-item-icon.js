/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import Color from 'color';
import { dialog, getCurrentWindow } from '@electron/remote';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Badge from '@mui/material/Badge';
import ListItem from '@mui/material/ListItem';
import { Box } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux';

import CheckIcon from '@mui/icons-material/Check';

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

const ListItemIcon = () => {
  const dispatch = useDispatch();

  const accountInfo = useSelector((state) => state.dialogWorkspacePreferences.form.accountInfo);
  const color = useSelector((state) => state.dialogWorkspacePreferences.form.preferences.color);
  const downloadingIcon = useSelector((state) => state.dialogWorkspacePreferences.downloadingIcon);
  const id = useSelector((state) => state.dialogWorkspacePreferences.form.id || '');
  const name = useSelector((state) => state.dialogWorkspacePreferences.form.name || '');
  const order = useSelector((state) => state.dialogWorkspacePreferences.form.order || 0);
  const pictureId = useSelector((state) => state.dialogWorkspacePreferences.form.pictureId);
  const imgPath = useSelector((state) => state.dialogWorkspacePreferences.form.imgPath);
  const preferredIconType = useSelector(
    (state) => state.dialogWorkspacePreferences.form.preferredIconType,
  );
  const shouldUseDarkColors = useSelector((state) => state.general.shouldUseDarkColors);
  const transparentBackground = useSelector(
    (state) => Boolean(state.dialogWorkspacePreferences.form.transparentBackground),
  );

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
    <Box
      sx={{
        position: 'relative',
        mr: 2,
      }}
      title={title}
    >
      {selectedIconType === type ? (
        <Badge
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          badgeContent={(
            <Box
              sx={(theme) => ({
                background: theme.palette.primary.main,
                borderRadius: 12,
                width: 24,
                height: 24,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 18,
                color: theme.palette.common.white,
              })}
            >
              <CheckIcon fontSize="inherit" />
            </Box>
          )}
        >
          <Box
            sx={(theme) => [
              {
                fontFamily: theme.typography.fontFamily,
                height: 36,
                width: 36,
                background: theme.palette.common.white,
                borderRadius: 4,
                color: theme.palette.getContrastText(theme.palette.common.white),
                fontSize: 24,
                lineHeight: '36px',
                textAlign: 'center',
                fontWeight: 400,
                textTransform: 'uppercase',
                userSelect: 'none',
                boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 0 1px 1px rgba(0, 0, 0, 0.12)',
                overflow: 'hidden',
                cursor: 'pointer',
              },
              type === 'image' && transparentBackground && {
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                color: 'text.primary',
              },
              { boxShadow: `0 0 4px 4px ${theme.palette.primary.main}` },
              ...avatarAdditionalClassnames,
            ]}
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
          </Box>
        </Badge>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          sx={(theme) => [
            {
              fontFamily: theme.typography.fontFamily,
              height: 36,
              width: 36,
              background: theme.palette.common.white,
              borderRadius: 4,
              color: theme.palette.getContrastText(theme.palette.common.white),
              fontSize: 24,
              lineHeight: '36px',
              textAlign: 'center',
              fontWeight: 400,
              textTransform: 'uppercase',
              userSelect: 'none',
              boxShadow: theme.palette.mode === 'dark' ? 'none' : '0 0 1px 1px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden',
              cursor: 'pointer',
            },
            type === 'image' && transparentBackground && {
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              color: 'text.primary',
            },
            ...avatarAdditionalClassnames,
          ]}
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
        </Box>
      )}
    </Box>
  );

  return (
    <ListItem>
      <Box
        sx={{ flex: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box
            sx={{
              py: 1,
              pl: 0,
              pr: 4,
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            {!isMenubarBrowser() && renderAvatar(
              getAvatarText(id, finalName, order),
              'text',
              'Text',
              [(theme) => ({
                background: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black,
                color: theme.palette.getContrastText(theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
              })],
            )}
            {renderAvatar(
              <Box
                component="img"
                alt="Icon"
                sx={{
                  height: 36,
                  width: 36,
                }}
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
              <Box
                component="img"
                alt="Icon"
                sx={{
                  height: 36,
                  width: 36,
                }}
                src={`file://${getPicturePath(accountInfo.pictureId, 'account-pictures')}`}
              />,
              'accountInfo',
              'Account\'s Picture',
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              pt: 2,
              pr: 0,
            }}
          >
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
                    dialog.showOpenDialog(getCurrentWindow(), opts)
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
                <Typography variant="caption" sx={{ display: 'block' }}>
                  PNG, JPEG, GIF, TIFF or BMP.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => dispatch(getIconFromInternet(true))}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => dispatch(getIconFromAppSearch(true))}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from Our Database'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ mt: 1 }}
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => dispatch(removePicture())}
                >
                  Reset to Default
                </Button>
              </>
            )}
          </Box>
        </Box>
        {selectedIconType === 'image' && !isMenubarBrowser() && (
          <FormGroup>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={transparentBackground}
                  onChange={(e) => dispatch(
                    updateForm({ transparentBackground: e.target.checked }),
                  )}
                />
              )}
              label="Use transparent background"
            />
          </FormGroup>
        )}
      </Box>
    </ListItem>
  );
};

export default ListItemIcon;
