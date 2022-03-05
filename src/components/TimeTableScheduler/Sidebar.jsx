import React, { useState } from "react";
import { Box, FormControlLabel, Button, Checkbox } from "@mui/material";
import { timeTableStyles } from "../../styles/TimeTable";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

export default function Sidebar({ openModal, courses = [] }) {
    const classes = timeTableStyles();
    const [checkedPracticalClasses, setCheckedPracticalClasses] = useState(true);
    const [checkedTheoreticalClasses, setCheckedTheoreticalClasses] = useState(true);

    return (
        <div id="sidebar" className="sidebar">
            <Box sx={{ display: "flex" }}>
                <Button
                    variant="outlined"
                    onClick={openModal}
                    className={classes.flexCenterStart}
                    sx={{ p: 1.25, flexGrow: 1 }}
                >
                    <DashboardCustomizeRoundedIcon sx={{ height: "auto", marginRight: "0.5rem" }} />
                    <span>Editar UCs</span>
                </Button>

                <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
                    <FormControlLabel
                        label="Teóricas"
                        control={
                            <Checkbox
                                size="small"
                                color="default"
                                sx={{ p: 0.25 }}
                                style={{ fontSize: 20 }}
                                checked={checkedTheoreticalClasses}
                                onChange={(event) => setCheckedTheoreticalClasses(event.target.checked)}
                            />
                        }
                    />
                    <FormControlLabel
                        label="Práticas"
                        control={
                            <Checkbox
                                size="small"
                                color="default"
                                sx={{ p: 0.25 }}
                                style={{ fontSize: 20 }}
                                checked={checkedPracticalClasses}
                                onChange={(event) => setCheckedPracticalClasses(event.target.checked)}
                            />
                        }
                    />
                </Box>
            </Box>

            <section className={classes.pickersBox}>
                {courses.map((uc, ucIdx) => (
                    <div className={classes.picker} key={`${uc}-${ucIdx}`}>
                        {uc}
                    </div>
                ))}
            </section>
        </div>
    );
}
