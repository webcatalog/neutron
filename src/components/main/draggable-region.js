/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import connectComponent from '../../helpers/connect-component';

const styles = () => ({
  root: {
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
  // BrowserView has different position & width because of sidebar
  rootWithCompactSidebar: {
    // sidebar width is 68px
    // scroll bar width is 16px
    width: 'calc(100vw - 68px - 16px)',
    left: 68,
  },
  rootWithExpandedSidebar: {
    // sidebar width is 256px
    // scroll bar width is 16px
    width: 'calc(100vw - 256px - 16px)',
    left: 256,
  },
});

const DraggableRegion = ({
  classes,
  isFullScreen,
  navigationBar,
  sidebar,
  sidebarSize,
  titleBar,
}) => {
  // on macOS, if all top bars are hidden
  // the top 22px part of BrowserView should be draggable
  if (window.process.platform === 'darwin' && !isFullScreen && !navigationBar && !titleBar) {
    return (
      <div
        className={classnames(
          classes.root,
          sidebar && sidebarSize === 'compact' && classes.rootWithCompactSidebar,
          sidebar && sidebarSize === 'expanded' && classes.rootWithExpandedSidebar,
        )}
      />
    );
  }

  return null;
};

DraggableRegion.propTypes = {
  classes: PropTypes.object.isRequired,
  isFullScreen: PropTypes.bool.isRequired,
  navigationBar: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  sidebarSize: PropTypes.oneOf(['compact', 'expanded']).isRequired,
  titleBar: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  navigationBar: (window.process.platform === 'linux'
    && state.preferences.attachToMenubar
    && !state.preferences.sidebar)
    || state.preferences.navigationBar,
  sidebar: state.preferences.sidebar,
  sidebarSize: state.preferences.sidebarSize,
  titleBar: state.preferences.titleBar,
  isFullScreen: state.general.isFullScreen,
});

export default connectComponent(
  DraggableRegion,
  mapStateToProps,
  null,
  styles,
);
