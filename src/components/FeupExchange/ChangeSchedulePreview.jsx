import React from "react";
import { Box } from "@mui/material";
import { useStyles, sxs } from "../../styles/ChangeScheduleForm";

export default function ChangeSchedulePreview() {
    const classes = useStyles();

    return (
        <Box display="flex" sx={sxs.flexColumn}>
            <h4 className={classes.header}>Previsão do novo horário</h4>
        </Box>
    );
}
