import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

export default function CourseCheckboxes({ coursesPicked, setCoursesPicked, year, semester, ucs }) {
    const [checked, setChecked] = useState(Array(ucs.length).fill(false));

    return (
        <div>
            {/* Parent checkbox */}
            <FormControlLabel
                label={`${year}º Ano`}
                control={
                    <Checkbox
                        onChange={(event) => {
                            setChecked(Array(ucs.length).fill(event.target.checked));
                            if (event.target.checked) setCoursesPicked(ucs);
                            else setCoursesPicked([]);
                        }}
                        checked={checked.every((element) => element === true)}
                        indeterminate={checked.includes(true) && !checked.every((element) => element === true)}
                    />
                }
            />

            {/* Children checkboxes */}
            <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={0} sx={{ ml: 3 }}>
                {ucs.map((uc, ucIdx) => (
                    <Box gridColumn="span 1" key={`Y${year}S${semester}-${uc}`}>
                        <FormControlLabel
                            label={uc}
                            control={
                                <Checkbox
                                    size="small"
                                    checked={checked[ucIdx]}
                                    onChange={(event) => {
                                        let checks = [];
                                        let pickedCopy = coursesPicked;

                                        for (let i = 0; i < checked.length; i++) {
                                            if (i !== ucIdx) checks.push(checked[i]);
                                            else {
                                                checks.push(event.target.checked);
                                                if (event.target.checked) pickedCopy.push(ucs[i]);
                                                else pickedCopy = pickedCopy.filter((item) => item !== ucs[i]);
                                            }
                                        }

                                        setCoursesPicked(pickedCopy);
                                        setChecked(checks);

                                        console.log(checks);
                                        console.log(pickedCopy);
                                    }}
                                />
                            }
                        />
                    </Box>
                ))}
            </Box>
        </div>
    );
}
