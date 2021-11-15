import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => {
  const baseTabStyle = {
    minWidth: 24,
    maxWidth: 240,
    height: 32,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 7,
    padding: '0px 8px',
    boxSizing: 'border-box',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: theme.palette.background,
    outline: 'none',
    position: 'relative',
    margin: '0px -1px'
  };
  const tabStateCommonStyle = {
    content: "''",
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 0,
    height: 24,
    width: 16,
  };

  return {
    tab: {
      ...baseTabStyle,
    },
    tabActive: {
      ...baseTabStyle,
      backgroundColor: (props) => props.highlightColor,
      '&:hover': {
        zIndex: 1,
        width: 'calc(100% + 2px)',
      },
      zIndex: 3,
      '&:before': {
        ...tabStateCommonStyle,
        left: -16,
        borderBottomRightRadius: 12,
        boxShadow: (props) => `8px 0 0 0 ${props.highlightColor}`,
      },
      '&:after': {
        ...tabStateCommonStyle,
        right: -16,
        borderBottomLeftRadius: 12,
        boxShadow: (props) => `-8px 0 0 0 ${props.highlightColor}`,
        zIndex: 1,
      },
    },
  };
});
  
const Tab = ({ imageUrl, imageAlt, title, highlightColor, onClick, onClose }) => {
  const classes = useStyles({ highlightColor });

  return (
    <div className={classes.tab} tabIndex={0} onClick={onClick}>
      {imageUrl && <img height={'16px'} width={'16px'} src={imageUrl} alt={imageAlt} />}
      <div margin={'0 6px 0 6px'}>
        {title}
      </div>
    </div>
  );
};

export default Tab;