import React from "react";
import { Box } from "@mui/material";
import { useStyles, sxs } from "../../styles/ChangeScheduleForm";
import SelectCourses from "./SelectCourses";
import SelectClassOptions from "./SelectClassOptions";
import ScheduleBoxFormat from "./ScheduleBoxFormat";

export default function ChangeScheduleForm() {
    const classes = useStyles();

    return (
        <Box display="flex" sx={sxs.flexColumn}>
            <h4 className={classes.header}>Mudança de Horário</h4>
            <Box display="flex">
                <ScheduleBoxFormat />
            </Box>

            <Box display="flex" sx={sxs.spaceAbove}>
                <SelectCourses />
                <SelectClassOptions />
            </Box>
        </Box>
    );
}
