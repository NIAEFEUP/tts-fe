import React from "react";
import { MenuProps, names, ucs, getStyles } from "../../utils";
import { useTheme } from "@mui/material/styles";
import { useStyles, sxs } from "../../styles/ChangeScheduleForm";
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

export default function ChooseOptions() {
    const theme = useTheme();
    const classes = useStyles();
    const [personName, setPersonName] = React.useState([]);

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;

        // On autofill we get a stringified value.
        setPersonName(typeof value === "string" ? value.split(",") : value);
    };

    return (
        <Box display="flex" sx={{ display: "block", flexGrow: 1 }}>
            <h5 className={classes.subheader}>Novas opções</h5>
            <Box display="flex" sx={sxs.flexColumn}>
                {ucs.map((uc, ucIdx) => (
                    <FormControl sx={sxs.select} key={`${uc.acronym}-${ucIdx}`} size="small">
                        <InputLabel sx={sxs.input} id="multiple-chip-label">
                            {`${uc.name} (${uc.acronym})`}
                        </InputLabel>
                        <Select
                            multiple
                            id="multiple-chip"
                            labelId="multiple-chip-label"
                            value={personName}
                            MenuProps={MenuProps}
                            onChange={handleChange}
                            input={<OutlinedInput id="select-multiple-chip" label={`${uc.name} (${uc.acronym})`} />}
                            renderValue={(selected) => (
                                <Box sx={sxs.selectValue}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ))}
            </Box>
        </Box>
    );
}
