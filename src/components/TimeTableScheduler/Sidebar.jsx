import React from "react";
import { timeTableStyles } from "../../styles/TimeTable";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import { Button } from "@mui/material";

export default function Sidebar({ openModal, coursesPicked }) {
    const classes = timeTableStyles();

    return (
        <div>
            <Button variant="outlined" onClick={openModal} className={classes.flexCenterStart}>
                <DashboardCustomizeRoundedIcon sx={{ height: "auto", marginRight: "0.5rem" }} />
                <span>Editar UCs</span>
            </Button>
            <ul>
                {coursesPicked.map((uc, ucIdx) => (
                    <li key={`${uc}-${ucIdx}`}>{uc}</li>
                ))}
            </ul>
        </div>
    );
}
