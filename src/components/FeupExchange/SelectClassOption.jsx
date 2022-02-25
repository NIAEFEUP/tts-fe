import React from "react";
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
import { useTheme } from "@mui/material/styles";
import { sxs } from "../../styles/ChangeScheduleForm";
import { MenuProps, courseSchedules, getStyles } from "../../utils";

export default function SelectClassOption({ course, index }) {
    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        // On autofill we get a stringified value.
        setPersonName(typeof value === "string" ? value.split(",") : value);
    };

    return (
        <FormControl sx={sxs.select} key={`${course.acronym}-${index}`} size="small">
            <InputLabel sx={sxs.input} id="multiple-chip-label">
                {`${course.name} (${course.acronym})`}
            </InputLabel>
            <Select
                multiple
                id="multiple-chip"
                labelId="multiple-chip-label"
                value={personName}
                MenuProps={MenuProps}
                onChange={handleChange}
                input={<OutlinedInput id="select-multiple-chip" label={`${course.name} (${course.acronym})`} />}
                renderValue={(selected) => (
                    <Box sx={sxs.selectValue}>
                        {selected.map((value) => (
                            <Chip key={value} label={value} />
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
                            style={getStyles(schedule.class, personName, theme)}
                        >
                            <Checkbox checked={personName.indexOf(displayName) > -1} />
                            <ListItemText primary={displayName} />
                        </MenuItem>
                    );
                })}
            </Select>
        </FormControl>
    );
}
