import React, { useState } from "react";
import ScheduleTable from "../components/ScheduleTable/ScheduleTable";
import ChangeScheduleForm from "../components/ScheduleTable/Form/ChangeScheduleForm";
import ChangeSchedulePreview from "../components/ScheduleTable/Form/ChangeSchedulePreview";
import { useStyles, sxs } from "../styles/FeupExchange";
import { Box } from "@mui/material";

export default function SchedulePage() {
    const classes = useStyles();
    const [selectedClasses, setSelectedClasses] = useState([]);

    return (
        <div className={classes.container}>
            <Box sx={sxs.wrapper}>
                <Box sx={sxs.form} className={classes.height}>
                    <ChangeScheduleForm selectedClasses={selectedClasses} setSelectedClasses={setSelectedClasses} />
                </Box>
                <Box sx={sxs.preview} className={classes.height}>   
                    <ChangeSchedulePreview />
                    <ScheduleTable selectedClasses={selectedClasses}/>
                </Box>
            </Box>
        </div>
    );
}
