import React, { useState } from "react";
import { Box } from "@mui/material";
import { ucs } from "../../utils";
import { useStyles, sxs } from "../../styles/ChangeScheduleForm";
import SelectCourses from "./SelectCourses";
import SelectClassOptions from "./SelectClassOptions";
import ScheduleBoxFormat from "./ScheduleBoxFormat";

export default function ChangeScheduleForm({ selectedClasses, setSelectedClasses }) {
    const classes = useStyles();
    const [checked, setChecked] = useState(Array(ucs.length).fill(false));

    return (
        <Box display="flex" sx={sxs.flexColumn}>
            <h4 className={classes.header}>Mudança de Horário</h4>
            <Box display="flex">
                <ScheduleBoxFormat ucs={ucs} />
            </Box>

            <Box display="flex" sx={sxs.spaceAbove}>
                <SelectCourses checkedHook={[checked, setChecked]} ucs={ucs} />
                <SelectClassOptions
                    checkedHook={[checked, setChecked]}
                    ucs={ucs}
                    selectedClasses={selectedClasses}
                    setSelectedClasses={setSelectedClasses}
                />
            </Box>
        </Box>
    );
}
