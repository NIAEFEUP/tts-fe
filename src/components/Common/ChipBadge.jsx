import React from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    badge: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        backgroundColor: "#725757",
        width: "1rem",
        height: "1rem",
        margin: "1rem -0.1rem 1rem 0.3rem",
        borderRadius: "200px",
        fontSize: "x-small",
    },
}));

export default function ChipBadge({ label }) {
    const classes = useStyles();
    return <span className={classes.badge}>{label}</span>;
}
