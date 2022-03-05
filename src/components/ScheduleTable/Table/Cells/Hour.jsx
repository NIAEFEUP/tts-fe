import React from "react";
import { timeTableStyles } from "../../../../styles/TimeTable";
import { getHourList } from "../ScheduleUtils";
import { Box } from "@mui/material";

export function Hours() {
    const hourList = ["", ...getHourList()];
    return hourList.map((hour, top) => {
        const classes = timeTableStyles({ top });
        return <Box className={classes.hourCell}>{hour}</Box>;
    });
}
