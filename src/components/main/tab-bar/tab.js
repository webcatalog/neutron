/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { IconButton, makeStyles } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import themeColors from '../../../constants/theme-colors';

const useStyle = makeStyles((theme) => ({
  root: {
    flex: 1,
    maxWidth: theme.spacing(30),
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    borderRight: (props) => {
      if (props.themeColor != null) {
        return `1px solid ${themeColors[props.themeColor][800]}`;
      }
      return `1px solid ${theme.palette.background.paper}`;
    },
    WebkitAppRegion: 'no-drag',
  },
  rootActive: {
    borderRight: 'none',
    backgroundColor: (props) => {
      if (props.themeColor != null) {
        return themeColors[props.themeColor][800];
      }
      return theme.palette.background.paper;
    },
  },
  title: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  iconButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: theme.spacing(0.5),
  },
}));

const Tab = ({
  active, themeColor, onClose, onSelect, name,
}) => {
  const classes = useStyle({ themeColor });

  return (
    <div
      role="button"
      tabIndex={0}
      className={classnames(classes.root, active && classes.rootActive)}
      onClick={onSelect ? () => onSelect() : undefined}
      onKeyDown={onSelect ? (e) => {
        if (e.key === 'Enter') {
          onSelect();
        }
      } : undefined}
    >
      <div className={classes.title}>
        {name || 'Tab'}
      </div>
      {onClose && (
        <div className={classes.iconButtonContainer}>
          <IconButton
            size="small"
            onClick={() => onClose()}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}
    </div>
  );
};

Tab.defaultProps = {
  active: false,
  themeColor: undefined,
  onClose: undefined,
  onSelect: undefined,
  name: undefined,
};

Tab.propTypes = {
  active: PropTypes.bool,
  name: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  themeColor: PropTypes.string,
};

export default Tab;
