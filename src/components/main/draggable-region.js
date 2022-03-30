/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from 'react';

import { useSelector } from 'react-redux';
import { Box } from '@mui/material';

const DraggableRegion = () => {
  const isFullScreen = useSelector((state) => state.general.isFullScreen);
  const titleBar = useSelector((state) => state.preferences.titleBar);
  const sidebarSize = useSelector((state) => state.preferences.sidebarSize);
  const sidebar = useSelector((state) => state.preferences.sidebar);
  const navigationBar = useSelector((state) => (window.process.platform === 'linux'
  && state.preferences.attachToMenubar
  && !state.preferences.sidebar) || state.preferences.navigationBar);
  // on macOS, if all top bars are hidden
  // the top 22px part of BrowserView should be draggable
  if (window.process.platform === 'darwin' && !isFullScreen && !navigationBar && !titleBar) {
    return (
      <Box
        sx={[
          {
            // big sur increases title bar height to 28px
            // but following Electron@13, somehow the height is now also 22px on Big Sur
            // scroll bar width is 20px
            height: 22,
            width: 'calc(100vw - 16px)',
            WebkitAppRegion: 'drag',
            WebkitUserSelect: 'none',
            background: 'transparent',
            position: 'absolute',
            top: 0,
            left: 0,
          },
          sidebar && sidebarSize === 'compact' && {
            // sidebar width is 68px
            // scroll bar width is 16px
            width: 'calc(100vw - 68px - 16px)',
            left: 68,
          },
          sidebar && sidebarSize === 'expanded' && {
            // sidebar width is 256px
            // scroll bar width is 16px
            width: 'calc(100vw - 256px - 16px)',
            left: 256,
          },
        ]}
      />
    );
  }

  return null;
};

export default DraggableRegion;
