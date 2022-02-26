import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    footer: {
        height: "3rem",
        color: "#fff",
        backgroundColor: theme.palette.dark.light,
    },
}));

const Footer = () => {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <div>This is the footer!</div>
        </div>
    );
};

export default Footer;
