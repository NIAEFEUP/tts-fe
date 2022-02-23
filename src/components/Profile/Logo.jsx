import React from "react";
import { makeStyles } from "@mui/styles";

import logo from "../../images/logo-dark.png";

const Logo = () => {
    const useStyles = makeStyles({
        logo: {
            display: "block",
            margin: "auto",
            height: "auto",
            width: "17rem",
        },
    });

    const classes = useStyles();

    return <img src={logo} alt="Feup Exchange Logo" className={classes.logo} />;
};

export default Logo;
