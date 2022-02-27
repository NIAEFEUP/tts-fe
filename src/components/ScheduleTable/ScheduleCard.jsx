import React from 'react'; 
import {Box} from "@mui/material";

/**
 * Displays the a card of a subject in the schedule table.
 * @param {*} subjectInfo
 * @returns
 */
export default function ScheduleCard({ subjectInfo }) {
    return (
        <Box sx={{ p: 2, color: "white", fontWeight: "bold" }}>
            {subjectInfo.acronym} ·{subjectInfo.class}·{subjectInfo.name} ·{subjectInfo.time} ·{subjectInfo.teacher} ·
            {subjectInfo.room}
        </Box>
    );
}
