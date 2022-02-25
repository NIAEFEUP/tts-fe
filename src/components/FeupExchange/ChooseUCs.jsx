import React from "react";
import { ucs } from "../../utils";
import { useStyles } from "../../styles/ChangeScheduleForm";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";

export default function ChooseUCs() {
    const classes = useStyles();

    return (
        <FormGroup display="grid" className={classes.form}>
            <h5 className={classes.subheader}>UCs A Alterar</h5>
            {ucs.map((uc, ucIdx) => (
                <FormControlLabel
                    label={uc.acronym}
                    key={`${uc.acronym}-${ucIdx}`}
                    control={<Checkbox size="small" className={classes.checkbox} />}
                />
            ))}
        </FormGroup>
    );
}
