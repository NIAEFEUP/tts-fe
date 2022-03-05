import React from "react";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import { Typography, AppBar, Button, MenuItem } from "@mui/material";

const Header = () => {
    return (
        <AppBar position="static" color="primary">
            <Toolbar variant="dense">
                <MenuItem component={Link} to={"/"}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                        TTS Niaefeup
                    </Typography>
                </MenuItem>
                <MenuItem component={Link} to={"/timetable"}>
                    <Button color="inherit">Time Table</Button>
                </MenuItem>
                <MenuItem component={Link} to={"/feupexchange"}>
                    <Button color="inherit">FEUP exchange</Button>
                </MenuItem>
                <MenuItem component={Link} to={"/profile"}>
                    <Button color="inherit">Profile</Button>
                </MenuItem>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
