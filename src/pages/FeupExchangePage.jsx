import * as React from "react";
import Box from "@mui/material/Box";
import Student from "../components/Profile/Student";
import ProfileCard from "../components/Profile/ProfileCard";
import { feupExchangeStyles } from "../styles/FeupExchange";

export default function FeupExchangePage() {
    let student = new Student({
        id: "id",
        name: "Afonso Medeiros",
        email: "up20xxxxxxx@edu.fe.up.pt",
        profilePicture: "some-path.png",
    });
    const classes = feupExchangeStyles();

    return (
        <div className={classes.container}>
            <Box
                sx={{
                    display: "flex",
                    borderRadius: 1,
                    padding: "1rem",
                }}
            >
                <Box>
                    <ProfileCard student={student} />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                    <div className="schedule"></div>
                </Box>
            </Box>
        </div>
    );
}
