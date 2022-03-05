import React from "react";
import { Box } from "@mui/material";
import { useStyles, sxs } from "../../../styles/ChangeScheduleForm";
import SelectClassOptions from "./SelectClassOptions";

export default function ChangeScheduleForm({ selectedClasses, setSelectedClasses }) {
    const classes = useStyles();
    return (
        <Box display="flex" sx={sxs.flexColumn}>
            <h4 className={classes.header}>Escolha de horário</h4>

            <Box display="flex" sx={sxs.spaceAbove, sxs.flexColumn}>
                <SelectClassOptions selectedClasses={selectedClasses} setSelectedClasses={setSelectedClasses} />
            </Box>
        </Box>
    );
}
