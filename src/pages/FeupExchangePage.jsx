import React from "react";
import Box from "@mui/material/Box";
import Student from "../components/Profile/Student";
import ProfileCard from "../components/Profile/ProfileCard";
import { useStyles, sxs } from "../styles/FeupExchange";
import ChangeScheduleForm from "../components/FeupExchange/ChangeScheduleForm";
import ChangeSchedulePreview from "../components/FeupExchange/ChangeSchedulePreview";

export default function FeupExchangePage() {
    let student = new Student({
        id: "id",
        name: "Afonso Medeiros",
        email: "up20xxxxxxx@edu.fe.up.pt",
        profilePicture: "some-path.png",
    });

    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Box sx={sxs.wrapper}>
                <Box sx={sxs.spacing}>
                    <ProfileCard student={student} />
                </Box>

                <Box sx={sxs.form} className={classes.height}>
                    <ChangeScheduleForm />
                </Box>

                <Box sx={sxs.preview} className={classes.height}>
                    <ChangeSchedulePreview />
                </Box>
            </Box>
        </div>
    );
}
