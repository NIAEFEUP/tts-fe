import React from "react";
import { ucs } from "../../utils";
import { Box } from "@mui/material";
import { useStyles, sxs } from "../../styles/ChangeScheduleForm";
import SelectClassOption from "./SelectClassOption";

export default function SelectClassOptions() {
    const classes = useStyles();

    return (
        <Box display="flex" sx={{ display: "block", flexGrow: 1 }}>
            <h5 className={classes.subheader}>Novas opções</h5>
            <Box display="flex" sx={sxs.flexColumn}>
                {ucs.map((uc, ucIdx) => (
                    <SelectClassOption course={uc} index={ucIdx} key={`option-box-${uc.acronym}`} />
                ))}
            </Box>
        </Box>
    );
}
