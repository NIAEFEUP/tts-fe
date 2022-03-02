import React from "react";
import { Box } from "@mui/material";
import { hourToIndex, dayToIndex } from "./ScheduleUtils";
import { timeTableStyles } from "../../../styles/TimeTable";

export default function ScheduleCell({ left, top, rowSpan, text, classType }) {
    const classes = timeTableStyles({ left, top, rowSpan, classType });
    return (
        <Box align="center" key={top} className={classes.tableCard}>
            {text}
        </Box>
    );
}
