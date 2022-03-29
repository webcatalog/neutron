/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import Color from 'color';
import { dialog, getCurrentWindow } from '@electron/remote';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Badge from '@mui/material/Badge';
import { Box } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@mui/icons-material/Check';

import getAvatarText from '../../helpers/get-avatar-text';
import getMailtoUrl from '../../helpers/get-mailto-url';
import camelCaseToSentenceCase from '../../helpers/camel-case-to-sentence-case';
import isMenubarBrowser from '../../helpers/is-menubar-browser';

import themeColors from '../../constants/theme-colors';

import {
  getIconFromInternet,
  getIconFromAppSearch,
  save,
  updateForm,
  resetForm,
} from '../../state/dialog-add-workspace/actions';

import defaultWorkspaceImageLight from '../../images/default-workspace-image-light.png';
import defaultWorkspaceImageDark from '../../images/default-workspace-image-dark.png';

const AddWorkspaceCustom = () => {
  const dispatch = useDispatch();

  const color = useSelector((state) => state.dialogAddWorkspace.form.color);
  const downloadingIcon = useSelector((state) => state.dialogAddWorkspace.downloadingIcon);
  const homeUrl = useSelector((state) => state.dialogAddWorkspace.form.homeUrl);
  const homeUrlError = useSelector((state) => state.dialogAddWorkspace.form.homeUrlError);
  const internetIcon = useSelector((state) => state.dialogAddWorkspace.form.internetIcon);
  const isMailApp = useSelector(
    (state) => Boolean(getMailtoUrl(state.dialogAddWorkspace.form.homeUrl)),
  );
  const name = useSelector((state) => state.dialogAddWorkspace.form.name);
  const nameError = useSelector((state) => state.dialogAddWorkspace.form.nameError);
  const imgPath = useSelector((state) => state.dialogAddWorkspace.form.imgPath);
  const preferredIconType = useSelector((state) => state.dialogAddWorkspace.form.preferredIconType);
  const shouldUseDarkColors = useSelector((state) => state.general.shouldUseDarkColors);
  const transparentBackground = useSelector(
    (state) => Boolean(state.dialogAddWorkspace.form.transparentBackground),
  );

  let selectedIconType = 'text';
  if (((imgPath || internetIcon) && preferredIconType === 'auto') || (preferredIconType === 'image')) {
    selectedIconType = 'image';
  }

  const backgroundColor = color ? themeColors[color][600] : null;

  const renderAvatar = (avatarContent, type, title = null, avatarAdditionalClassnames = []) => (
    <Box
      sx={{
        position: 'relative',
        float: 'left',
        '&:not(:first-child)': {
          ml: 2,
        },
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
              sx={{
                bgcolor: 'primary.main',
                borderRadius: 12,
                width: 24,
                height: 24,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '18px',
                color: 'common.white',
              }}
            >
              <CheckIcon fontSize="inherit" />
            </Box>
          )}
        >
          <Box
            sx={[
              {
                fontFamily: 'fontFamily',
                height: 36,
                width: 36,
                background: 'common.white',
                borderRadius: 1,
                color: (theme) => theme.palette.getContrastText(theme.palette.common.white),
                fontSize: '24px',
                lineHeight: '36px',
                textAlign: 'center',
                fontWeight: 400,
                textTransform: 'uppercase',
                userSelect: 'none',
                boxShadow: (theme) => (theme.palette.mode === 'dark' ? 'none' : '0 0 1px 1px rgba(0, 0, 0, 0.12)'),
                overflow: 'hidden',
                cursor: 'pointer',
              },
              transparentBackground && {
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
              },
              {
                boxShadow: (theme) => `0 0 4px 4px ${theme.palette.primary.main}`,
              },
              ...avatarAdditionalClassnames,
            ]}
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
          </Box>
        </Badge>
      ) : (
        <Box
          role="button"
          tabIndex={0}
          sx={[
            {
              fontFamily: 'fontFamily',
              height: 36,
              width: 36,
              background: 'common.white',
              borderRadius: 1,
              color: (theme) => theme.palette.getContrastText(theme.palette.common.white),
              fontSize: '24px',
              lineHeight: '36px',
              textAlign: 'center',
              fontWeight: 400,
              textTransform: 'uppercase',
              userSelect: 'none',
              boxShadow: (theme) => (theme.palette.mode === 'dark' ? 'none' : '0 0 1px 1px rgba(0, 0, 0, 0.12)'),
              overflow: 'hidden',
              cursor: 'pointer',
            },
            transparentBackground && {
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
            },
            ...avatarAdditionalClassnames,
          ]}
          onClick={() => dispatch(updateForm({ preferredIconType: type }))}
          onKeyDown={() => dispatch(updateForm({ preferredIconType: type }))}
        >
          {avatarContent}
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      sx={{
        background: 'background.paper',
        height: 1,
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          px: 2,
          py: 3,
          overflow: 'auto',
        }}
      >
        <TextField
          label="Name"
          error={Boolean(nameError)}
          placeholder="Example"
          helperText={nameError}
          fullWidth
          margin="dense"
          variant="outlined"
          sx={{ mb: 3 }}
          InputLabelProps={{
            shrink: true,
          }}
          value={name}
          onChange={(e) => dispatch(updateForm({ name: e.target.value }))}
        />
        <TextField
          label="Home URL"
          error={Boolean(homeUrlError)}
          placeholder="https://example.com"
          helperText={homeUrlError || (isMailApp && 'Email app detected.')}
          fullWidth
          margin="dense"
          variant="outlined"
          sx={{ mb: 3 }}
          InputLabelProps={{
            shrink: true,
          }}
          value={homeUrl}
          onChange={(e) => dispatch(updateForm({ homeUrl: e.target.value }))}
        />
        <Box
          sx={{ pb: 1 }}
        >
          <Box
            sx={[
              {
                height: 24,
                width: 24,
                borderRadius: 12,
                mr: 1,
                cursor: 'pointer',
                outline: 'none',
                display: 'inline-block',
              },
              color == null && {
                boxShadow: (theme) => `0 0 2px 2px ${theme.palette.primary.main}`,
              },
            ]}
            title="None"
            style={{ backgroundColor: shouldUseDarkColors ? '#fff' : '#000' }}
            aria-label="None"
            role="button"
            tabIndex={0}
            onClick={() => dispatch(updateForm({
              color: null,
            }))}
            onKeyDown={() => dispatch(updateForm({
              color: null,
            }))}
          />
          {Object.keys(themeColors).map((val) => (
            <Box
              key={val}
              title={camelCaseToSentenceCase(val)}
              sx={[
                {
                  height: 24,
                  width: 24,
                  borderRadius: 12,
                  mr: 1,
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'inline-block',
                },
                color === val && {
                  boxShadow: (theme) => `0 0 2px 2px ${theme.palette.primary.main}`,
                },
              ]}
              style={{ backgroundColor: themeColors[val][600] }}
              aria-label={val}
              role="button"
              tabIndex={0}
              onClick={() => dispatch(updateForm({
                color: val,
              }))}
              onKeyDown={() => dispatch(updateForm({
                color: val,
              }))}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 1,
          }}
        >
          <Box
            sx={{
              py: 1,
              pl: 0,
              pr: 4,
            }}
          >
            {!isMenubarBrowser() && renderAvatar(
              getAvatarText(null, name, null),
              'text',
              'Text',
              [{
                background: (theme) => (theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
                color: (theme) => theme.palette.getContrastText(theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black),
              }],
            )}
            {renderAvatar(
              <Box
                component="img"
                alt="Icon"
                sx={{
                  height: 1,
                  width: 1,
                }}
                src={(() => {
                  if (imgPath) return `file://${imgPath}`;
                  if (internetIcon) return internetIcon;
                  return shouldUseDarkColors
                    ? defaultWorkspaceImageLight : defaultWorkspaceImageDark;
                })()}
              />,
              'image',
              'Image',
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              py: 1,
              px: 0,
            }}
          >
            {selectedIconType === 'image' && (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
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
                          dispatch(updateForm({
                            preferredIconType: 'image',
                            imgPath: filePaths[0],
                          }));
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
                  color="inherit"
                  size="small"
                  sx={{ mt: 1 }}
                  disabled={Boolean(!homeUrl || homeUrlError || downloadingIcon)}
                  onClick={() => dispatch(getIconFromInternet(true))}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ mt: 1 }}
                  disabled={Boolean(!homeUrl || homeUrlError || downloadingIcon)}
                  onClick={() => dispatch(getIconFromAppSearch(true))}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from Our Database'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  color="inherit"
                  size="small"
                  sx={{ mt: 1 }}
                  disabled={Boolean(downloadingIcon)}
                  onClick={() => dispatch(updateForm({
                    imgPath: null,
                    internetIcon: null,
                  }))}
                >
                  Reset to Default
                </Button>
                {!isMenubarBrowser() && (
                  <FormGroup>
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={transparentBackground}
                          onChange={(e) => dispatch(updateForm({
                            transparentBackground: e.target.checked,
                          }))}
                        />
                      )}
                      label="Use transparent background"
                    />
                  </FormGroup>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          px: 2,
          py: 1,
        }}
      >
        <Button color="primary" variant="contained" disableElevation sx={{ float: 'right' }} onClick={() => dispatch(save())}>
          Add
        </Button>
        <Button
          variant="text"
          color="inherit"
          disableElevation
          sx={{
            mr: 1,
            float: 'right',
            ':hover': {
              backgroundColor: 'rgb(0 0 0 / 16%)',
            },
          }}
          onClick={() => dispatch(resetForm())}
        >
          Reset
        </Button>
      </Box>
    </Box>
  );
};

export default AddWorkspaceCustom;
