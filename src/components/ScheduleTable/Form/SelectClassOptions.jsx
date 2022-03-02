import React from "react";
import { ucs } from "../../../utils";
import { Box } from "@mui/material";
import { useStyles, sxs } from "../../../styles/ChangeScheduleForm";
import SelectClassOption from "./SelectClassOption";

export default function SelectClassOptions({ selectedClasses, setSelectedClasses }) {
    const classes = useStyles();

    return (
        <Box display="flex" sx={{ display: "block", flexGrow: 1, minWidth: "300px" }}>
            <h5 className={classes.subheader}>Seleção</h5>
            <Box display="flex" sx={sxs.flexColumn}>
                {ucs.map((uc, ucIdx) => (
                    <SelectClassOption
                        course={uc}
                        index={ucIdx}
                        key={`option-box-${uc.acronym}`}
                        selectedClasses={selectedClasses}
                        setSelectedClasses={setSelectedClasses}
                    />
                ))}
            </Box>
        </Box>
    );
}
