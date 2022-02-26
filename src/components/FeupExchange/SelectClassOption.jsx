import React from "react";
import { sxs } from "../../styles/ChangeScheduleForm";
import { useTheme } from "@mui/material/styles";
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

export default function SelectClassOption({ course, index }) {
    const theme = useTheme();
    const [scheduleChoice, setScheduleChoice] = React.useState([]);
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setScheduleChoice(typeof value === "string" ? value.split(",") : value); // On autofill we get a stringified value.
    };

    const getStyles = (displayName, scheduleChoice, theme) => {
        return {
            fontWeight:
                scheduleChoice.indexOf(displayName) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
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
                        {selected.map((value) => (
                            <Chip color="primary" key={value} label={value} />
                        ))}
                    </Box>
                )}
            >
                {courseSchedules.map((schedule) => {
                    let displayName = `${schedule.class}, ${schedule.teacher}, ${schedule.weekday}, ${schedule.time}`;
                    return (
                        <MenuItem
                            key={`${course.acronym}-${schedule.class}`}
                            value={displayName}
                            style={getStyles(schedule.class, scheduleChoice, theme)}
                        >
                            <Checkbox checked={scheduleChoice.indexOf(displayName) > -1} />
                            <ListItemText primary={displayName} />
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
