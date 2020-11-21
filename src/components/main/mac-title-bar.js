/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import connectComponent from '../../helpers/connect-component';
import getUrlFromText from '../../helpers/get-url-from-text';

import {
  requestLoadUrl,
} from '../../senders';

const styles = (theme) => {
  // big sur increases title bar height
  const titleBarHeight = window.remote.getGlobal('isMacOs11') ? 28 : 22;
  return {
    root: {
      background: theme.palette.type === 'dark' ? '#2a2b2c' : 'linear-gradient(top, #e4e4e4, #cecece)',
      height: titleBarHeight,
      WebkitAppRegion: 'drag',
      WebkitUserSelect: 'none',
      textAlign: 'center',
      lineHeight: `${titleBarHeight}px`,
      fontSize: '13px',
      color: theme.palette.type === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgb(77, 77, 77)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
      fontWeight: 500,
      paddingLeft: 72,
      paddingRight: 72,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    rootMenubar: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
  };
};

const FakeTitleBar = (props) => {
  const {
    classes,
    title,
    searchEngine,
  } = props;

  if (window.process.platform !== 'darwin') return null;

  return (
    <div
      className={classnames(classes.root, window.mode === 'menubar' && classes.rootMenubar)}
      onDoubleClick={() => {
        // feature: double click on title bar to expand #656
        // https://github.com/webcatalog/webcatalog-app/issues/656
        const win = window.remote.getCurrentWindow();
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        const text = e.dataTransfer.getData('URL') || e.dataTransfer.getData('text');
        if (text) {
          e.preventDefault();
          const processedUrl = getUrlFromText(text, searchEngine);
          requestLoadUrl(processedUrl);
        }
      }}
    >
      {(window.mode === 'main' || window.mode === 'menubar') && title ? title : window.remote.getGlobal('appJson').name}
    </div>
  );
};

FakeTitleBar.defaultProps = {
  title: '',
};

FakeTitleBar.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string,
  searchEngine: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  title: state.general.title,
  searchEngine: state.preferences.searchEngine,
});

export default connectComponent(
  FakeTitleBar,
  mapStateToProps,
  null,
  styles,
);
