import React from 'react';
import { makeStyles } from '@mui/styles';
import Selection from '../components/Selection';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '2rem',
  },
}));

const FeupExchangePage = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      Welcome to the FeupExchangePage!
      <Selection />
    </div>
  );
};

export default FeupExchangePage;
