import React, {useState} from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@mui/styles";
import { Home, Assessment, Today, Tune, Menu } from '@mui/icons-material';

import Student from "./Student";
import OptionRow from "./OptionRow";
import Logo from "./Logo";
import { Avatar, Divider, Grid, Button } from "@mui/material";

const useStyles = makeStyles((theme) => ({
    profileCard: {
        maxWidth: "17em",
        height: "80vh",
        border: "1px solid " + theme.palette.dark.main,
        borderRadius: "10px",
        margin: "1em",
        padding: "2em",
        position: "relative",
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
    closeSidebar: {
        position: "absolute",
        bottom: "2em",
        right: "2em",
        border: "1px solid " + theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
        }
    },
    bottomButton: {
        position: "absolute",
        bottom: "2em",
        left: "2em",
        backgroundColor: "#dddddd",
        border: "1px solid " + theme.palette.dark.main,
        "&:hover": {
            backgroundColor: "#dddddd",
        }
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


            <Button
                variant="contained"
                color="secondary"
                className={classes.bottomButton} 
            >
                Something
            </Button>


            <Button 
                className={classes.closeSidebar} 
                variant="contained"
                color="secondary"
            >
                <Menu />
            </Button>
            

        </div>
    );
};

ProfileCard.propTypes = {
    student: PropTypes.instanceOf(Student),
};

export default ProfileCard;
