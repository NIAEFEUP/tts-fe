import React from "react";
import { feupExchangeStyles } from "../styles/FeupExchange";
import Student from "../components/Profile/Student";
import ProfileCard from "../components/Profile/ProfileCard";
import { Grid } from "@mui/material";

const FeupExchangePage = () => {
    let student = new Student({
        id: "id",
        name: "Afonso Medeiros",
        email: "up20xxxxxxx@edu.fe.up.pt",
        profilePicture: "some-path.png",
    });
    const classes = feupExchangeStyles();

    return (
        <Grid container className={classes.container}>
            <Grid container spacing={2} className={classes.container}>
                <Grid item xs={12} sm={8} md={6} xl={4}>
                    <ProfileCard student={student} />
                </Grid>
                <Grid item xs={12} sm={8} md={6} xl={4}>
                    <div></div>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default FeupExchangePage;
