/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
  createTheme,
  adaptV4Theme,
} from '@mui/material/styles';
// or @mui/lab/Adapter{Dayjs,Luxon,Moment} or any valid date-io adapter
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import CssBaseline from '@mui/material/CssBaseline';
import { useSelector } from 'react-redux';

import { blue, pink as red, grey } from '@mui/material/colors';
import getStaticGlobal from '../helpers/get-static-global';

import WindowsTitleBar from './shared/windows-title-bar';
import AppLock from './app-lock';

const AppWrapper = ({ children }) => {
  const isFullScreen = useSelector((state) => state.general.isFullScreen);
  const locked = useSelector((state) => window.mode !== 'about' && state.general.locked);
  const shouldUseDarkColors = useSelector((state) => state.general.shouldUseDarkColors);

  const themeObj = {
    typography: {
      fontFamily: '"Roboto",-apple-system,BlinkMacSystemFont,"Segoe UI",Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      fontSize: 13.5,
    },
    palette: {
      mode: shouldUseDarkColors ? 'dark' : 'light',
      primary: {
        light: blue[300],
        main: blue[600],
        dark: blue[800],
      },
      secondary: {
        light: red[300],
        main: red[500],
        dark: red[700],
      },
    },
  };

  if (!shouldUseDarkColors) {
    themeObj.background = {
      primary: grey[200],
    };
  }

  const theme = createTheme(adaptV4Theme(themeObj));

  const showWindowsTitleBar = window.process.platform !== 'darwin' && !isFullScreen && !getStaticGlobal('useSystemTitleBar');

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <CssBaseline />
          <div
            style={{
              height: '100vh',
              width: '100vw',
              overflow: 'hidden',
            }}
          >
            {showWindowsTitleBar && <WindowsTitleBar title={window.mode !== 'main' ? document.title : undefined} />}
            <div style={{ height: showWindowsTitleBar ? 'calc(100vh - 32px)' : '100vh' }}>
              {locked ? <AppLock /> : children}
            </div>
          </div>
        </LocalizationProvider>
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
};

AppWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppWrapper;
