import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    timetableSection: {},
}));

const Timetable = () => {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={9} className={classes.timetable}>
            Timetable
        </Grid>
    );
};

export default Timetable;
