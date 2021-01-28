/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CodeIcon from '@material-ui/icons/Code';
import ExtensionIcon from '@material-ui/icons/Extension';
import PowerIcon from '@material-ui/icons/Power';

import connectComponent from '../../helpers/connect-component';
import checkLicense from '../../helpers/check-license';
import roundTime from '../../helpers/round-time';
import isMas from '../../helpers/is-mas';

import appJson from '../../constants/app-json';

import {
  requestOpenInBrowser,
  requestRequestReloadWorkspaceDialog,
} from '../../senders';

import { open as openDialogCodeInjection } from '../../state/dialog-code-injection/actions';
import { open as openDialogCustomUserAgent } from '../../state/dialog-custom-user-agent/actions';
import { open as openDialogInternalUrls } from '../../state/dialog-internal-urls/actions';
import { open as openDialogRefreshInterval } from '../../state/dialog-refresh-interval/actions';
import { updateForm } from '../../state/dialog-workspace-preferences/actions';

import autoRefreshIntervals from '../../constants/auto-refresh-intervals';

import DialogCodeInjection from '../dialog-code-injection';
import DialogCustomUserAgent from '../dialog-custom-user-agent';
import DialogInternalUrls from '../dialog-internal-urls';
import DialogRefreshInterval from '../dialog-refresh-interval';

import SnackbarTrigger from '../shared/snackbar-trigger';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(2),
    background: theme.palette.background.default,
    height: '100%',
    width: '100%',
    overflow: 'auto',
  },
  sectionTitle: {
    paddingLeft: theme.spacing(2),
  },
  paper: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(3),
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
  },
  sidebar: {
    position: 'fixed',
    width: 204,
    color: theme.palette.text.primary,
  },
  inner: {
    width: '100%',
    maxWidth: 512,
    float: 'right',
  },
  link: {
    cursor: 'pointer',
    fontWeight: 500,
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:focus': {
      textDecoration: 'underline',
    },
  },
  sliderContainer: {
    paddingLeft: theme.spacing(5),
    paddingRight: theme.spacing(5),
  },
  sliderTitleContainer: {
    paddingTop: `${theme.spacing(1.5)}px !important`,
    width: 100,
  },
  sliderMarkLabel: {
    fontSize: '0.75rem',
  },
  selectRoot: {
    borderRadius: theme.spacing(0.5),
    fontSize: '0.84375rem',
  },
  selectRootExtraMargin: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  select: {
    paddingTop: theme.spacing(1),
    paddingRight: 26,
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
  },
  refreshEvery: {
    float: 'right',
    paddingRight: theme.spacing(1),
  },
});

const Preferences = ({
  askForDownloadPath,
  autoRefresh,
  autoRefreshInterval,
  autoRefreshOnlyWhenInactive,
  classes,
  cssCodeInjection,
  customUserAgent,
  darkReader,
  downloadPath,
  internalUrlRule,
  jsCodeInjection,
  onOpenDialogCodeInjection,
  onOpenDialogCustomUserAgent,
  onOpenDialogInternalUrls,
  onOpenDialogRefreshInterval,
  onUpdateForm,

  formAskForDownloadPath,
  formAutoRefresh,
  formAutoRefreshInterval,
  formAutoRefreshOnlyWhenInactive,
  formCssCodeInjection,
  formCustomUserAgent,
  formDarkReader,
  formDarkReaderBrightness,
  formDarkReaderContrast,
  formDarkReaderGrayscale,
  formDarkReaderSepia,
  formDownloadPath,
  formInternalUrlRule,
  formJsCodeInjection,
}) => {
  const utmSource = isMas() ? `${appJson.id}_app` : 'juli_app';
  const workspaceId = window.remote.getGlobal('workspacePreferencesWorkspaceId');

  const sections = {
    extensions: {
      text: 'Extensions',
      Icon: ExtensionIcon,
      ref: useRef(),
    },
    downloads: {
      text: 'Downloads',
      Icon: CloudDownloadIcon,
      ref: useRef(),
    },
    developers: {
      text: 'Developers',
      Icon: CodeIcon,
      ref: useRef(),
    },
    advanced: {
      text: 'Advanced',
      Icon: PowerIcon,
      ref: useRef(),
    },
  };

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <List dense>
          {Object.keys(sections).map((sectionKey, i) => {
            const {
              Icon, text, ref, hidden,
            } = sections[sectionKey];
            if (hidden) return null;
            return (
              <React.Fragment key={sectionKey}>
                {i > 0 && <Divider />}
                <ListItem button onClick={() => ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                  />
                </ListItem>
              </React.Fragment>
            );
          })}
        </List>
      </div>
      <div className={classes.inner}>
        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.extensions.ref}>
          Extensions
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem>
              <ListItemText
                primary="Create dark themes for web pages on the fly"
                secondary={(
                  <>
                    <span>Powered by </span>
                    <span
                      role="link"
                      tabIndex={0}
                      className={classes.link}
                      onClick={() => requestOpenInBrowser('https://darkreader.org/')}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        requestOpenInBrowser('https://darkreader.org/');
                      }}
                    >
                      Dark Reader
                    </span>
                    <span>.</span>
                  </>
                )}
              />
              <Select
                value={formDarkReader != null ? formDarkReader : 'global'}
                onChange={(e) => onUpdateForm({
                  darkReader: e.target.value !== 'global' ? e.target.value : null,
                })}
                variant="filled"
                disableUnderline
                margin="dense"
                classes={{
                  root: classes.select,
                }}
                className={classes.selectRoot}
              >
                <MenuItem dense value="global">{`Same as global (${darkReader ? 'Yes' : 'No'})`}</MenuItem>
                <MenuItem dense value>Yes</MenuItem>
                <MenuItem dense value={false}>No</MenuItem>
              </Select>
            </ListItem>
            {formDarkReader && (
              <ListItem>
                <ListItemText className={classes.sliderContainer}>
                  <Grid container spacing={2}>
                    <Grid classes={{ item: classes.sliderTitleContainer }} item>
                      <Typography id="brightness-slider" variant="body2" gutterBottom={false}>
                        Brightness
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        classes={{ markLabel: classes.sliderMarkLabel }}
                        value={formDarkReaderBrightness - 100}
                        aria-labelledby="brightness-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        valueLabelFormat={(val) => {
                          if (val > 0) return `+${val}`;
                          return val;
                        }}
                        marks={[
                          {
                            value: formDarkReaderBrightness - 100,
                            label: `${formDarkReaderBrightness > 100 ? '+' : ''}${formDarkReaderBrightness - 100}`,
                          },
                        ]}
                        min={-50}
                        max={50}
                        onChange={(e, value) => {
                          onUpdateForm({ darkReaderBrightness: value + 100 });
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid classes={{ item: classes.sliderTitleContainer }} item>
                      <Typography id="contrast-slider" variant="body2" gutterBottom={false}>
                        Contrast
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        classes={{ markLabel: classes.sliderMarkLabel }}
                        value={formDarkReaderContrast - 100}
                        aria-labelledby="contrast-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        valueLabelFormat={(val) => {
                          if (val > 0) return `+${val}`;
                          return val;
                        }}
                        marks={[
                          {
                            value: formDarkReaderContrast - 100,
                            label: `${formDarkReaderContrast > 100 ? '+' : ''}${formDarkReaderContrast - 100}`,
                          },
                        ]}
                        min={-50}
                        max={50}
                        onChange={(e, value) => {
                          onUpdateForm({ darkReaderContrast: value + 100 });
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid classes={{ item: classes.sliderTitleContainer }} item>
                      <Typography id="sepia-slider" variant="body2" gutterBottom={false}>
                        Sepia
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        classes={{ markLabel: classes.sliderMarkLabel }}
                        value={formDarkReaderSepia}
                        aria-labelledby="sepia-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        marks={[
                          {
                            value: formDarkReaderSepia,
                            label: `${formDarkReaderSepia}`,
                          },
                        ]}
                        min={0}
                        max={100}
                        onChange={(e, value) => {
                          onUpdateForm({ darkReaderSepia: value });
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid classes={{ item: classes.sliderTitleContainer }} item>
                      <Typography id="grayscale-slider" variant="body2" gutterBottom={false}>
                        Grayscale
                      </Typography>
                    </Grid>
                    <Grid item xs>
                      <Slider
                        classes={{ markLabel: classes.sliderMarkLabel }}
                        value={formDarkReaderGrayscale}
                        aria-labelledby="grayscale-slider"
                        valueLabelDisplay="auto"
                        step={5}
                        marks={[
                          {
                            value: formDarkReaderGrayscale,
                            label: `${formDarkReaderGrayscale}`,
                          },
                        ]}
                        min={0}
                        max={100}
                        onChange={(e, value) => {
                          onUpdateForm({ darkReaderGrayscale: value });
                        }}
                      />
                    </Grid>
                  </Grid>
                </ListItemText>
              </ListItem>
            )}
            <Divider />
            <ListItem>
              <ListItemText
                primary="Reload web pages automatically"
              />
              <Select
                value={formAutoRefresh != null ? formAutoRefresh : 'global'}
                onChange={(e) => {
                  onUpdateForm({
                    autoRefresh: e.target.value !== 'global' ? e.target.value : null,
                  });
                  requestRequestReloadWorkspaceDialog(workspaceId);
                }}
                variant="filled"
                disableUnderline
                margin="dense"
                classes={{
                  root: classes.select,
                }}
                className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
              >
                <MenuItem dense value="global">{`Same as global (${autoRefresh ? 'Yes' : 'No'})`}</MenuItem>
                <MenuItem dense value>Yes</MenuItem>
                <MenuItem dense value={false}>No</MenuItem>
              </Select>
            </ListItem>
            {formAutoRefresh && (
              <>
                <ListItem>
                  <ListItemText primary="Reload every" classes={{ primary: classes.refreshEvery }} />
                  <Select
                    value={formAutoRefreshInterval || autoRefreshInterval}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        onOpenDialogRefreshInterval();
                        return;
                      }
                      onUpdateForm({
                        autoRefreshInterval: e.target.value,
                      });
                      requestRequestReloadWorkspaceDialog(workspaceId);
                    }}
                    variant="filled"
                    disableUnderline
                    margin="dense"
                    classes={{
                      root: classes.select,
                    }}
                    className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                  >
                    {autoRefreshIntervals.map((opt) => (
                      <MenuItem key={opt.value} dense value={opt.value}>{opt.name}</MenuItem>
                    ))}
                    {(() => {
                      const val = formAutoRefreshInterval || autoRefreshInterval;
                      const isCustom = autoRefreshIntervals
                        .find((interval) => interval.value === val) == null;
                      if (isCustom) {
                        const time = roundTime(val);
                        return (
                          <MenuItem dense value={val}>
                            {`${time.value} ${time.unit}`}
                          </MenuItem>
                        );
                      }
                      return null;
                    })()}
                    <MenuItem dense value="custom">Custom</MenuItem>
                  </Select>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Only reload on inactivity"
                    secondary={(
                      <>
                        <span>Keep certain apps from logging </span>
                        <span>out automatically when you are away. </span>
                        <span
                          role="link"
                          tabIndex={0}
                          className={classes.link}
                          onClick={() => requestOpenInBrowser(`https://help.webcatalog.app/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${utmSource}`)}
                          onKeyDown={(e) => {
                            if (e.key !== 'Enter') return;
                            requestOpenInBrowser(`https://help.webcatalog.app/article/25-how-to-prevent-apps-from-logging-me-out-on-inactivity?utm_source=${utmSource}`);
                          }}
                        >
                          Learn more
                        </span>
                        <span>.</span>
                      </>
                    )}
                  />
                  <Select
                    value={formAutoRefreshOnlyWhenInactive != null ? formAutoRefreshOnlyWhenInactive : 'global'}
                    onChange={(e) => {
                      onUpdateForm({
                        autoRefreshOnlyWhenInactive: e.target.value !== 'global' ? e.target.value : null,
                      });
                      requestRequestReloadWorkspaceDialog(workspaceId);
                    }}
                    variant="filled"
                    disableUnderline
                    margin="dense"
                    classes={{
                      root: classes.select,
                    }}
                    className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
                  >
                    <MenuItem dense value="global">{`Same as global (${autoRefreshOnlyWhenInactive ? 'Yes' : 'No'})`}</MenuItem>
                    <MenuItem dense value>Yes</MenuItem>
                    <MenuItem dense value={false}>No</MenuItem>
                  </Select>
                </ListItem>
              </>
            )}
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.downloads.ref}>
          Downloads
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem
              button
              onClick={() => {
                window.remote.dialog.showOpenDialog(window.remote.getCurrentWindow(), {
                  properties: ['openDirectory'],
                  // Create a security scoped bookmark when packaged for the Mac App Store
                  // https://developer.apple.com/library/archive/documentation/Security/Conceptual/AppSandboxDesignGuide/AppSandboxInDepth/AppSandboxInDepth.html#//apple_ref/doc/uid/TP40011183-CH3-SW16
                  securityScopedBookmarks: true,
                })
                  .then(({ canceled, filePaths }) => {
                    if (!canceled && filePaths && filePaths.length > 0) {
                      onUpdateForm({ downloadPath: filePaths[0] });
                    }
                  })
                  .catch(console.log); // eslint-disable-line
              }}
            >
              <ListItemText
                primary="Download Location"
                secondary={formDownloadPath != null ? formDownloadPath : `Same as global (${downloadPath})`}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText primary="Ask where to save each file before downloading" />
              <Select
                value={formAskForDownloadPath != null ? formAskForDownloadPath : 'global'}
                onChange={(e) => onUpdateForm({
                  askForDownloadPath: e.target.value !== 'global' ? e.target.value : null,
                })}
                variant="filled"
                disableUnderline
                margin="dense"
                classes={{
                  root: classes.select,
                }}
                className={classnames(classes.selectRoot, classes.selectRootExtraMargin)}
              >
                <MenuItem dense value="global">{`Same as global (${askForDownloadPath ? 'Yes' : 'No'})`}</MenuItem>
                <MenuItem dense value>Yes</MenuItem>
                <MenuItem dense value={false}>No</MenuItem>
              </Select>
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.developers.ref}>
          Developers
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={onOpenDialogCustomUserAgent}>
              <ListItemText
                primary="Custom User Agent"
                secondary={(() => {
                  if (formCustomUserAgent != null) {
                    return formCustomUserAgent;
                  }
                  return `Same as global (${customUserAgent || 'Not set'})`;
                })()}
                secondaryTypographyProps={{ noWrap: true }}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                if (!checkLicense()) return;
                onOpenDialogCodeInjection('js');
              }}
            >
              <ListItemText
                primary="JS Code Injection"
                secondary={(() => {
                  if (formJsCodeInjection != null) {
                    return formJsCodeInjection;
                  }
                  return `Same as global (${jsCodeInjection || 'Not set'})`;
                })()}
                secondaryTypographyProps={{ noWrap: true }}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
            <Divider />
            <ListItem
              button
              onClick={() => {
                if (!checkLicense()) return;
                onOpenDialogCodeInjection('css');
              }}
            >
              <ListItemText
                primary="CSS Code Injection"
                secondary={(() => {
                  if (formCssCodeInjection != null) {
                    return formCssCodeInjection;
                  }
                  return `Same as global (${cssCodeInjection || 'Not set'})`;
                })()}
                secondaryTypographyProps={{ noWrap: true }}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>

        <Typography variant="subtitle2" className={classes.sectionTitle} ref={sections.advanced.ref}>
          Advanced
        </Typography>
        <Paper elevation={0} className={classes.paper}>
          <List disablePadding dense>
            <ListItem button onClick={onOpenDialogInternalUrls}>
              <ListItemText
                primary="Internal URLs"
                secondary={(() => {
                  if (formInternalUrlRule != null) {
                    return `/^${formInternalUrlRule}$/i`;
                  }
                  return `Same as global (${internalUrlRule ? `/^${internalUrlRule}$/i` : 'Not set'})`;
                })()}
              />
              <ChevronRightIcon color="action" />
            </ListItem>
          </List>
        </Paper>
      </div>
      <DialogCodeInjection />
      <DialogCustomUserAgent />
      <DialogInternalUrls />
      <DialogRefreshInterval />
      <SnackbarTrigger />
    </div>
  );
};

Preferences.defaultProps = {
  cssCodeInjection: null,
  customUserAgent: null,
  internalUrlRule: null,
  jsCodeInjection: null,

  formAskForDownloadPath: null,
  formAutoRefresh: null,
  formAutoRefreshInterval: null,
  formAutoRefreshOnlyWhenInactive: null,
  formCssCodeInjection: null,
  formCustomUserAgent: null,
  formDarkReader: null,
  formDarkReaderBrightness: 100,
  formDarkReaderContrast: 100,
  formDarkReaderGrayscale: 0,
  formDarkReaderSepia: 0,
  formDownloadPath: null,
  formInternalUrlRule: null,
  formJsCodeInjection: null,
};

Preferences.propTypes = {
  askForDownloadPath: PropTypes.bool.isRequired,
  autoRefresh: PropTypes.bool.isRequired,
  autoRefreshInterval: PropTypes.number.isRequired,
  autoRefreshOnlyWhenInactive: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  cssCodeInjection: PropTypes.string,
  customUserAgent: PropTypes.string,
  darkReader: PropTypes.bool.isRequired,
  downloadPath: PropTypes.string.isRequired,
  internalUrlRule: PropTypes.string,
  jsCodeInjection: PropTypes.string,
  onOpenDialogCodeInjection: PropTypes.func.isRequired,
  onOpenDialogCustomUserAgent: PropTypes.func.isRequired,
  onOpenDialogInternalUrls: PropTypes.func.isRequired,
  onOpenDialogRefreshInterval: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,

  formAskForDownloadPath: PropTypes.bool,
  formAutoRefresh: PropTypes.bool,
  formAutoRefreshInterval: PropTypes.number,
  formAutoRefreshOnlyWhenInactive: PropTypes.bool,
  formCustomUserAgent: PropTypes.string,
  formDarkReader: PropTypes.bool,
  formDarkReaderBrightness: PropTypes.number,
  formDarkReaderContrast: PropTypes.number,
  formDarkReaderGrayscale: PropTypes.number,
  formDarkReaderSepia: PropTypes.number,
  formDownloadPath: PropTypes.string,
  formInternalUrlRule: PropTypes.string,
  formJsCodeInjection: PropTypes.string,
  formCssCodeInjection: PropTypes.string,
};

const mapStateToProps = (state) => ({
  askForDownloadPath: state.preferences.askForDownloadPath,
  autoRefresh: state.preferences.autoRefresh,
  autoRefreshInterval: state.preferences.autoRefreshInterval,
  autoRefreshOnlyWhenInactive: state.preferences.autoRefreshOnlyWhenInactive,
  cssCodeInjection: state.preferences.cssCodeInjection,
  customUserAgent: state.preferences.customUserAgent,
  darkReader: state.preferences.darkReader,
  downloadPath: state.preferences.downloadPath,
  internalUrlRule: state.preferences.internalUrlRule,
  jsCodeInjection: state.preferences.jsCodeInjection,

  formAskForDownloadPath: state.dialogWorkspacePreferences.form.askForDownloadPath,
  formAutoRefresh: state.dialogWorkspacePreferences.form.autoRefresh,
  formAutoRefreshInterval: state.dialogWorkspacePreferences.form.autoRefreshInterval,
  formAutoRefreshOnlyWhenInactive:
    state.dialogWorkspacePreferences.form.autoRefreshOnlyWhenInactive,
  formDarkReader: state.dialogWorkspacePreferences.form.darkReader,
  formDarkReaderBrightness: state.dialogWorkspacePreferences.form.darkReaderBrightness,
  formDarkReaderContrast: state.dialogWorkspacePreferences.form.darkReaderContrast,
  formDarkReaderGrayscale: state.dialogWorkspacePreferences.form.darkReaderGrayscale,
  formDarkReaderSepia: state.dialogWorkspacePreferences.form.darkReaderSepia,
  formDownloadPath: state.dialogWorkspacePreferences.form.downloadPath,
  formAllowNodeInJsCodeInjection: state.dialogWorkspacePreferences.form.allowNodeInJsCodeInjection,
  formCssCodeInjection: state.dialogWorkspacePreferences.form.cssCodeInjection,
  formCustomUserAgent: state.dialogWorkspacePreferences.form.customUserAgent,
  formInternalUrlRule: state.dialogWorkspacePreferences.form.internalUrlRule,
  formJsCodeInjection: state.dialogWorkspacePreferences.form.jsCodeInjection,
});

const actionCreators = {
  openDialogCodeInjection,
  openDialogCustomUserAgent,
  openDialogInternalUrls,
  openDialogRefreshInterval,
  updateForm,
};

export default connectComponent(
  Preferences,
  mapStateToProps,
  actionCreators,
  styles,
);
