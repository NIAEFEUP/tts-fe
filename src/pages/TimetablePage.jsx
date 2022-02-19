import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Timetable from "../components/Timetable/Timetable";
import EditUCs from "../components/Timetable/EditUCs";

const useStyles = makeStyles((theme) => ({
    timetablePage: {
        padding: theme.spacing(3),
    },
}));

const TimetablePage = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.timetablePage} spacing={3}>
            <Timetable />
            <EditUCs />
        </Grid>
    );
};

export default TimetablePage;
