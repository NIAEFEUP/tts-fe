import React from "react";
import { Box } from "@mui/material";
import { useStyles, sxs } from "../../styles/ChangeScheduleForm";
import SelectClassOption from "./SelectClassOption";

export default function SelectClassOptions({ checkedHook, ucs }) {
    const classes = useStyles();
    const [checked] = checkedHook;

    return (
        <Box display="flex" sx={{ display: "block", flexGrow: 1 }}>
            <h5 className={classes.subheader}>Novas opções</h5>
            <Box display="flex" sx={sxs.flexColumn}>
                {ucs.map((uc, ucIdx) => (
                    <SelectClassOption active={checked[ucIdx]} course={uc} key={`option-box-${uc.acronym}`} />
                ))}
            </Box>
        </Box>
    );
}
