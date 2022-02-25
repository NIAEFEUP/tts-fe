import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import { Home, Assessment, Today, Tune } from "@mui/icons-material";

import Student from "./Student";
import OptionRow from "./OptionRow";
import Logo from "./Logo";
import { Avatar, Divider, Grid, Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    profileCard: {
        maxWidth: "17rem",
        minHeight: "75vh",
        maxHeight: "100%",
        border: "2px solid #eee",
        borderRadius: "0.5rem",
        backgroundColor: "#fafafa",
        padding: "1.5rem",
        position: "relative",
    },
    studentInfo: {
        margin: "1rem 0",
        display: "flex",
        flexDirection: "row",
    },
    profilePicture: {
        marginRight: "1rem",
    },
    studentName: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: theme.palette.dark.main,
        marginBottom: "0.2rem",
    },
    divider: {
        margin: "1rem 0",
    },
    signOutButton: {
        width: "100%",
    },
    optionButtons: {
        textTransform: "none",
    },
    closeSidebar: {
        position: "absolute",
        bottom: "2rem",
        right: "2rem",
        border: "1px solid ",
        "&:hover": {
            backgroundColor: theme.palette.primary.main,
        },
    },
    bottomButton: {
        position: "absolute",
        bottom: "2rem",
        left: "2rem",
        backgroundColor: "#dddddd",
        border: "1px solid " + theme.palette.dark.main,
        "&:hover": {
            backgroundColor: "#dddddd",
        },
    },
}));

const ProfileCard = ({ student }) => {
    const [selectedButton, setSelectedButton] = useState("Home");

    const options = [
        { Icon: Home, label: "Home" },
        { Icon: Assessment, label: "Preferences" },
        { Icon: Today, label: "My Current Schedule" },
        { Icon: Tune, label: "Settings" },
    ];

    const classes = useStyles();

    return (
        <div className={classes.profileCard}>
            <Logo className={classes.logo} />
            <Divider className={classes.divider} />
            <Grid container className={classes.studentInfo}>
                <Grid item className={classes.profilePicture}>
                    <Avatar src={student?.profileImage} sx={{ width: 50, height: 50 }} />
                </Grid>
                <Grid item>
                    <div>
                        <div className={classes.studentName}>{student?.name}</div>
                        <div>{student?.email}</div>
                    </div>
                </Grid>
            </Grid>
            <Button variant="outlined" className={classes.signOutButton} color="secondary">
                Sign Out
            </Button>
            <Divider className={classes.divider} />
            {options.map(({ Icon, label }, key) => (
                <OptionRow
                    key={key}
                    Icon={Icon}
                    label={label}
                    selectedButton={selectedButton}
                    setSelectedButton={setSelectedButton}
                />
            ))}
        </div>
    );
};

ProfileCard.propTypes = {
    student: PropTypes.instanceOf(Student),
};

export default ProfileCard;
