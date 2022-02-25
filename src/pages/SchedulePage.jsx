import React from "react";
import ScheduleTable from "../components/ScheduleTable/ScheduleTable";
import ChangeScheduleForm from "../components/FeupExchange/ChangeScheduleForm";
import ChangeSchedulePreview from "../components/FeupExchange/ChangeSchedulePreview";
import { useStyles, sxs } from "../styles/FeupExchange";
import { Box } from "@mui/material";

export default function SchedulePage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Box sx={sxs.wrapper}>
                <Box sx={sxs.form} className={classes.height}>
                    <ChangeScheduleForm />
                </Box>
                <Box sx={sxs.preview} className={classes.height}>
                    <ChangeSchedulePreview />
                    <ScheduleTable></ScheduleTable>
                </Box>
            </Box>
        </div>
    );
}
