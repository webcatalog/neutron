/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles/colorManipulator';

import { useSelector } from 'react-redux';

import getUrlFromText from '../../helpers/get-url-from-text';
import getStaticGlobal from '../../helpers/get-static-global';
import isMacOs11 from '../../helpers/is-mac-os-11';

import themeColors from '../../constants/theme-colors';

import {
  requestLoadUrl,
} from '../../senders';

import NavigationButtons from '../shared/navigation-buttons';

const useStyles = makeStyles((theme) => {
  // Big Sur increases title bar height: https://github.com/microsoft/vscode/pull/110592 (28px)
  // older macOS versions use 22px
  // but we use 28px on all versions to fit the navigation buttons
  const titleBarHeight = isMacOs11() ? 28 : 22;
  return {
    root: {
      background: (props) => {
        if (props.themeColor != null) {
          return themeColors[props.themeColor][900];
        }
        return theme.palette.type === 'dark' ? '#2a2b2c' : '#efefef';
      },
      borderBottom: '1px solid',
      borderBottomColor: theme.palette.divider,
      height: titleBarHeight,
      WebkitAppRegion: 'drag',
      WebkitUserSelect: 'none',
      textAlign: 'center',
      lineHeight: `${titleBarHeight}px`,
      fontSize: '13px',
      color: (props) => {
        if (props.themeColor != null) {
          return alpha(theme.palette.getContrastText(themeColors[props.themeColor][900]), 0.7);
        }
        return theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgb(77, 77, 77)';
      },
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 500,
      paddingLeft: 72,
      paddingRight: 72,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    rootWithNavigationButtons: {
      paddingLeft: 148,
      paddingRight: 148,
    },
    rootMenubar: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    topRight: {
      position: 'absolute',
      top: -1,
      right: theme.spacing(1),
    },
  };
});

const FakeTitleBar = ({ themeColor }) => {
  const classes = useStyles({ themeColor });

  const title = useSelector((state) => state.general.title);
  const searchEngine = useSelector((state) => state.preferences.searchEngine);
  const navigationBar = useSelector((state) => (window.process.platform === 'linux'
  && state.preferences.attachToMenubar
  && !state.preferences.sidebar)
  || state.preferences.navigationBar);
  const titleBarNavigationButtons = useSelector(
    (state) => state.preferences.titleBarNavigationButtons,
  );

  if (window.process.platform !== 'darwin') return null;

  const showNavigationButtons = titleBarNavigationButtons && !navigationBar && window.mode !== 'menubar';

  const appJson = getStaticGlobal('appJson');
  return (
    <div
      className={classnames(
        classes.root,
        showNavigationButtons && classes.rootWithNavigationButtons,
        window.mode === 'menubar' && classes.rootMenubar,
      )}
      onDoubleClick={() => {
        // feature: double click on title bar to expand #656
        // https://github.com/webcatalog/webcatalog-app/issues/656

        // User can choose title bar behavior from macOS System Preferences > Dock & Menu Bar
        const systemPref = window.remote.systemPreferences.getUserDefault('AppleActionOnDoubleClick', 'string');

        switch (systemPref) {
          case 'Minimize': {
            const win = window.remote.getCurrentWindow();
            win.minimize();
            break;
          }
          case 'Maximize': {
            const win = window.remote.getCurrentWindow();
            if (win.isMaximized()) {
              win.unmaximize();
            } else {
              win.maximize();
            }
            break;
          }
          default: break;
        }
      }}
      onDragOver={(window.mode === 'main' || window.mode === 'menubar') ? (e) => {
        e.preventDefault();
      } : null}
      onDrop={(window.mode === 'main' || window.mode === 'menubar') ? (e) => {
        const text = e.dataTransfer.getData('URL') || e.dataTransfer.getData('text');
        if (text) {
          e.preventDefault();
          const processedUrl = getUrlFromText(text, searchEngine);
          requestLoadUrl(processedUrl);
        }
      } : null}
    >
      {(window.mode === 'main' || window.mode === 'menubar') && title ? title : appJson.name}

      {showNavigationButtons && (
        <div className={classes.topRight}>
          <NavigationButtons themeColor={themeColor} disableGutter={!isMacOs11()} />
        </div>
      )}
    </div>
  );
};

FakeTitleBar.defaultProps = {
  themeColor: null,
};

FakeTitleBar.propTypes = {
  themeColor: PropTypes.string,
};

export default FakeTitleBar;
