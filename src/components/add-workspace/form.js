/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import classnames from 'classnames';
import Color from 'color';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core';

import { useDispatch, useSelector } from 'react-redux';

import CheckIcon from '@material-ui/icons/Check';

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

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    overflow: 'auto',
  },
  actions: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  button: {
    float: 'right',
  },
  textField: {
    marginBottom: theme.spacing(3),
  },
  avatarFlex: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
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
    paddingLeft: 0,
    paddingRight: 0,
  },
  avatarContainer: {
    position: 'relative',
    float: 'left',
    '&:not(:first-child)': {
      marginLeft: theme.spacing(2),
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
}));

const AddWorkspaceCustom = () => {
  const classes = useStyles();
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
          onClick={() => dispatch(updateForm({ preferredIconType: type }))}
          onKeyDown={() => dispatch(updateForm({ preferredIconType: type }))}
        >
          {avatarContent}
        </div>
      )}
    </div>
  );

  return (
    <div className={classes.root}>
      <div className={classes.content}>
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
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          value={homeUrl}
          onChange={(e) => dispatch(updateForm({ homeUrl: e.target.value }))}
        />
        <div className={classes.colorPickerRow}>
          <div
            className={classnames(
              classes.colorPicker,
              color == null && classes.colorPickerSelected,
            )}
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
            <div
              key={val}
              title={camelCaseToSentenceCase(val)}
              className={classnames(
                classes.colorPicker,
                color === val && classes.colorPickerSelected,
              )}
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
        </div>
        <div className={classes.avatarFlex}>
          <div className={classes.avatarLeft}>
            {!isMenubarBrowser() && renderAvatar(
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
                  if (imgPath) return `file://${imgPath}`;
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
                <Typography variant="caption" className={classes.caption}>
                  PNG, JPEG, GIF, TIFF or BMP.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.buttonBot}
                  disabled={Boolean(!homeUrl || homeUrlError || downloadingIcon)}
                  onClick={() => dispatch(getIconFromInternet(true))}
                >
                  {downloadingIcon ? 'Downloading...' : 'Download Icon from URL'}
                </Button>
                <br />
                <Button
                  variant="outlined"
                  size="small"
                  className={classes.buttonBot}
                  disabled={Boolean(!homeUrl || homeUrlError || downloadingIcon)}
                  // onClick={() => onGetIconFromAppSearch(true)}
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
          </div>
        </div>
      </div>
      <Divider />
      <div className={classes.actions}>
        <Button color="primary" variant="contained" disableElevation className={classes.button} onClick={() => dispatch(save())}>
          Add
        </Button>
        <Button color="default" variant="text" disableElevation className={classes.button} onClick={() => dispatch(resetForm())}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export default AddWorkspaceCustom;
