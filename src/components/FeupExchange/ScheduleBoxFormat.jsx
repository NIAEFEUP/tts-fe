import React from "react";
import { useStyles } from "../../styles/ChangeScheduleForm";
import { Chip, Stack } from "@mui/material";

export default function ScheduleBoxFormat({ ucs }) {
    const classes = useStyles();

    return (
        <div>
            <h5 className={classes.subheader}>Turmas alocadas inicialmente</h5>
            {ucs.map((uc, ucIdx) => (
                <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ marginBottom: "0.25rem" }}
                    key={`schedule-box-${uc.acronym}`}
                >
                    <Chip color="primary" label={uc.acronym} sx={{ fontSize: "small", minWidth: 65 }} />
                    <Chip label={uc.weekday} sx={{ fontSize: "small", minWidth: 80 }} />
                    <Chip label={uc.time} sx={{ fontSize: "small", minWidth: 110 }} />
                    <Chip label={uc.room} sx={{ fontSize: "small", minWidth: 60 }} />
                    <Chip label={uc.teacher} sx={{ fontSize: "small", minWidth: 60 }} />
                    <Chip label={uc.class} sx={{ fontSize: "small", minWidth: 80 }} />
                </Stack>
            ))}
        </div>
    );
}
