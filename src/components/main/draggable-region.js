/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import connectComponent from '../../helpers/connect-component';

const styles = () => ({
  root: {
    height: 22,
    width: '100vw',
    WebkitAppRegion: 'drag',
    WebkitUserSelect: 'none',
    background: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  // BrowserView has different position & width because of sidebar
  rootWithSidebar: {
    width: 'calc(100vw - 68px)', // sidebar width is 68px
    left: 68,
  },
});

const DraggableRegion = ({
  classes, navigationBar, sidebar, titleBar,
}) => {
  // on macOS or menubar mode, if all bars are hidden
  // the top 22px part of BrowserView should be draggable
  if ((window.process.platform === 'darwin' || window.mode === 'menubar') && !navigationBar && !titleBar) {
    return <div className={classnames(classes.root, sidebar && classes.rootWithSidebar)} />;
  }

  return null;
};

DraggableRegion.propTypes = {
  classes: PropTypes.object.isRequired,
  navigationBar: PropTypes.bool.isRequired,
  sidebar: PropTypes.bool.isRequired,
  titleBar: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  navigationBar: (window.process.platform === 'linux'
    && state.preferences.attachToMenubar
    && !state.preferences.sidebar)
    || state.preferences.navigationBar,
  sidebar: state.preferences.sidebar,
  titleBar: state.preferences.titleBar,
});

export default connectComponent(
  DraggableRegion,
  mapStateToProps,
  null,
  styles,
);
