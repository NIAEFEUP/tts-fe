import React from "react";
import { Box } from "@mui/material";
import { useStyles, sxs } from "../../styles/ChangeScheduleForm";
import ChooseUCs from "./ChooseUCs";
import ChooseOptions from "./ChooseOptions";
import ScheduleBoxFormat from "./ScheduleBoxFormat";

export default function ChangeScheduleForm() {
    // eslint-disable-next-line
    const classes = useStyles();

    return (
        <Box display="flex" sx={sxs.flexColumn}>
            <Box display="flex">
                <ScheduleBoxFormat />
            </Box>

            <Box display="flex" sx={sxs.spaceAbove}>
                <ChooseUCs />
                <ChooseOptions />
            </Box>
        </Box>
    );
}
