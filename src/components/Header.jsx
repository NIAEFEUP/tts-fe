import React from 'react'
import Toolbar from '@mui/material/Toolbar';
import { Typography, AppBar, Button } from '@mui/material';
import Colors from '../style.js'


class Header extends React.Component {
  render() {
    return (
      <AppBar
        position="static"
        elevation={1}
        sx={{
          background: Colors.BLACK
        }}
      >
        <Toolbar variant="dense">
          <Typography
            variant="h6"
            sx={{
              mr: 2,
              color: Colors.RED
            }}
          >
            TTS Niaefeup
          </Typography>
          <Button href="#" color="inherit">
            Time Table
          </Button>
          <Button href="#" color="inherit">
            FEUP exchange
          </Button>
        </Toolbar>
      </AppBar>
    )
  }
}

export default Header;