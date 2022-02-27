import React from "react";
import { useStyles } from "../../styles/ChangeScheduleForm";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";

export default function SelectCourses({ checkedHook, ucs }) {
    const classes = useStyles();
    const [checked, setChecked] = checkedHook;

    return (
        <FormGroup display="grid" className={classes.form}>
            <h5 className={classes.subheader}>UCs A Alterar</h5>
            {ucs.map((uc, ucIdx) => (
                <FormControlLabel
                    label={uc.acronym}
                    checked={checked[ucIdx]}
                    onChange={(event) => {
                        let checks = [];
                        for (let i = 0; i < checked.length; i++) {
                            if (i !== ucIdx) checks.push(checked[i]);
                            else checks.push(event.target.checked);
                        }
                        setChecked(checks);
                    }}
                    key={`${uc.acronym}-${ucIdx}`}
                    control={<Checkbox size="small" className={classes.checkbox} />}
                />
            ))}
        </FormGroup>
    );
}
