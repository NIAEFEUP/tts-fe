import React, {useState} from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@mui/styles";
import { Home, Assessment, Today, Tune } from '@mui/icons-material';
import Button from '@mui/material/Button';

import Student from "./Student";
import OptionRow from "./OptionRow";
import Logo from "./Logo";
import { Avatar, Divider, Grid } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    profileCard: {
        maxWidth: "17em",
        height: "80vh",
        border: "2px solid black",
        margin: "1em",
        padding: "2em",
    },
    studentInfo: {
        margin: "1em 0",
    },
    profilePicture: {
        marginRight: "1em",
    },
    studentName: {
        fontSize: "1.2em",
        fontWeight: "bold",
        color: theme.palette.primary.main,
        marginBottom: "0.2em",
    },
    divider: {
        margin: "1em 0",
    },
    signOutButton: {
        width: "100%",
    },
    optionButtons: {
        textTransform: "none",
    },
}));

const ProfileCard = ({ student }) => {

    const [selectedButton, setSelectedButton] = useState("Home");

    const options = [
        {Icon: Home, label: "Home"},
        {Icon: Assessment, label: "My Schedule"},
        {Icon: Today, label: "Time Table Scheduler"},
        {Icon: Tune, label: "Preferences"},
    ];

    const classes = useStyles();

    return (
        <div className={classes.profileCard}>
            <Logo className={classes.logo}/>

            <Divider className={classes.divider} />

            <Grid container className={classes.studentInfo}>
                <Grid item className={classes.profilePicture}>
                    <Avatar 
                        src={student?.profileImage} 
                        sx={{ width: 50, height: 50 }}
                    />
                </Grid>
                <Grid item>
                    <div>
                        <div className={classes.studentName}>
                            {student?.name}
                        </div>
                        <div>
                            {student?.email}
                        </div>
                    </div>
                </Grid>
            </Grid>

            <Button variant="outlined" className={classes.signOutButton}>
                Sign Out
            </Button>

            <Divider className={classes.divider} />

            {options.map(({Icon, label}, key) => (
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
