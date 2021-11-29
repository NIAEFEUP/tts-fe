import React from "react";
import { makeStyles } from "@mui/styles";

import logo from "./tmp_logo.png";

const useStyles = makeStyles({
    logo: {
        display: "block",
        margin: "auto",
    },
});

const Logo = () => {

    const classes = useStyles();

    return (
        <img src={logo} alt="Logo" className={classes.logo} />
    );
};

export default Logo;
