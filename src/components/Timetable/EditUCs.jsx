import React from "react";
import { Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    editUCsSection: {
        // padding: theme.spacing(3),
    },
}));

const EditUCs = () => {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={3} className={classes.editUCs}>
            Edit UCs
        </Grid>
    );
};

export default EditUCs;
