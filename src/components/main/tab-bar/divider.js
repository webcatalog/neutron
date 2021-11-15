import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  divider: {
    backgroundColor: '#7C7F82',
    height: 16,
    width: 1,
    marginTop: 6,
  },
}));

const Divider = () => {
  const classes = useStyles();
  return (
    <div className={classes.divider}/>
  )
}

export default Divider;