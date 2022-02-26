import React from "react";
import { sxs } from "../../styles/ChangeScheduleForm";
import { MenuProps } from "../../utils";
import {
    Box,
    Chip,
    Select,
    MenuItem,
    Checkbox,
    InputLabel,
    FormControl,
    ListItemText,
    OutlinedInput,
} from "@mui/material";

export default function SelectClassOption({ course }) {
    const [scheduleChoice, setScheduleChoice] = React.useState([]);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setScheduleChoice(typeof value === "string" ? value.split(",") : value); // On autofill we get a stringified value.
    };

    const courseSchedules = [
        { class: "3MIEIC01", time: "09:00-11:00", weekday: "2ªf", teacher: "RGR" },
        { class: "3MIEIC02", time: "09:30-11:30", weekday: "2ªf", teacher: "PFS" },
        { class: "3MIEIC03", time: "10:30-12:30", weekday: "2ªf", teacher: "SFCF" },
        { class: "3MIEIC04", time: "11:00-13:00", weekday: "4ªf", teacher: "SFCF" },
        { class: "3MIEIC05", time: "11:00-13:00", weekday: "4ªf", teacher: "RGR" },
        { class: "3MIEIC06", time: "14:00-16:00", weekday: "6ªf", teacher: "RGR" },
        { class: "3MIEIC07", time: "14:00-16:00", weekday: "6ªf", teacher: "PFS" },
    ];

    return (
        <FormControl sx={sxs.select} size="small">
            <InputLabel sx={sxs.input} id="multiple-chip-label">
                {`${course.name} (${course.acronym})`}
            </InputLabel>
            <Select
                multiple
                id="multiple-chip"
                labelId="multiple-chip-label"
                value={scheduleChoice}
                MenuProps={MenuProps}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label={`${course.name} (${course.acronym})`} />}
                renderValue={(selected) => (
                    <Box sx={sxs.selectValue}>
                        {selected.map((value, valueIdx) => (
                            <Chip color="primary" key={`${value}-${valueIdx}`} label={`(${valueIdx + 1}) ${value}`} />
                        ))}
                    </Box>
                )}
            >
                {courseSchedules.map((schedule) => {
                    let option = `${schedule.class}, ${schedule.teacher}, ${schedule.weekday}, ${schedule.time}`;
                    let isChecked = scheduleChoice.indexOf(option) > -1;
                    let finalText = isChecked ? `(${scheduleChoice.indexOf(option) + 1}) ${option}` : option;

                    return (
                        <MenuItem key={`${course.acronym}-${schedule.class}`} value={option}>
                            <Checkbox checked={isChecked} />
                            <ListItemText primary={finalText} />
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
