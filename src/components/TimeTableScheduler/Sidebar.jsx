import React from "react";
import { Button } from "@mui/material";
import { timeTableStyles } from "../../styles/TimeTable";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

export default function Sidebar({ openModal, courses = [] }) {
    const classes = timeTableStyles();

    return (
        <div>
            <Button variant="outlined" onClick={openModal} className={classes.flexCenterStart}>
                <DashboardCustomizeRoundedIcon sx={{ height: "auto", marginRight: "0.5rem" }} />
                <span>Editar UCs</span>
            </Button>
            <ul>
                {courses.map((uc, ucIdx) => (
                    <li key={`${uc}-${ucIdx}`}>{uc}</li>
                ))}
            </ul>
        </div>
    );
}
