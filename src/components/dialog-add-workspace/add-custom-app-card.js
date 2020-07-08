import PropTypes from 'prop-types';
import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import CreateIcon from '@material-ui/icons/Create';

import connectComponent from '../../helpers/connect-component';

import { updateMode } from '../../state/dialog-add-workspace/actions';

const styles = (theme) => ({
  card: {
    width: '100%',
    boxSizing: 'border-box',
    borderRadius: 4,
    padding: theme.spacing(1.5),
    display: 'flex',
    cursor: 'pointer',
    color: theme.palette.text.primary,
    border: theme.palette.type === 'dark' ? 'none' : '1px solid rgba(0, 0, 0, 0.12)',
    '&:hover, &:focus': {
      backgroundColor: theme.palette.action.selected,
    },
    textAlign: 'left',
  },
  appName: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    lineHeight: 1,
    fontWeight: 500,
  },
  appUrl: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  paperIcon: {
    fontSize: '64px',
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    flex: 1,
  },
});

const AddCustomAppCard = (props) => {
  const {
    classes,
    onUpdateMode,
  } = props;

  return (
    <Grid item xs={12}>
      <Paper elevation={0} className={classes.card} onClick={() => onUpdateMode('custom')}>
        <div>
          <CreateIcon className={classes.paperIcon} />
        </div>
        <div className={classes.infoContainer}>
          <Typography variant="subtitle1" className={classes.appName}>
            Add Custom Workspace
          </Typography>
          <Typography variant="body2" color="textSecondary" className={classes.appUrl}>
            Make it your own!
          </Typography>
        </div>
      </Paper>
    </Grid>
  );
};

AddCustomAppCard.propTypes = {
  classes: PropTypes.object.isRequired,
  onUpdateMode: PropTypes.func.isRequired,
};

const actionCreators = {
  updateMode,
};

export default connectComponent(
  AddCustomAppCard,
  null,
  actionCreators,
  styles,
);
