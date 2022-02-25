import React from "react";
import { useStyles } from "../../styles/ChangeScheduleForm";
import { ucs } from "../../utils";
import { Chip, Stack } from "@mui/material";

export default function ScheduleBoxFormat() {
    const classes = useStyles();

    return (
        <div>
            <h4 className={classes.header}>Mudança de Horário</h4>
            <div>
                <h5 className={classes.subheader}>Turmas alocadas inicialmente</h5>
                {ucs.map((uc, ucIdx) => (
                    <>
                        <Stack direction="row" spacing={1} sx={{ marginBottom: "0.25rem", fontSize: "smaller" }}>
                            <Chip color="secondary" label={uc.acronym} sx={{ minWidth: 65 }} />
                            <Chip label={uc.weekday} sx={{ minWidth: 80 }} />
                            <Chip label={uc.time} sx={{ minWidth: 110 }} />
                            <Chip label={uc.room} sx={{ minWidth: 60 }} />
                            <Chip label={uc.teacher} sx={{ minWidth: 75 }} />
                            <Chip label={uc.class} sx={{ minWidth: 80 }} />
                        </Stack>
                    </>
                ))}
            </div>
        </div>
    );
}
