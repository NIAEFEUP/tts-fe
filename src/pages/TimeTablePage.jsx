import "../styles/utilities.css";
import React, { useState } from "react";
import TabPanel from "../components/Common/TabPanel";
import Sidebar from "../components/TimeTableScheduler/Sidebar";
import CourseSelection from "../components/TimeTableScheduler/CourseSelection";
import { timeTableStyles } from "../styles/TimeTable";
import { Box, Grid, Tabs, Tab } from "@mui/material";

const TimeTablePage = () => {
    const classes = timeTableStyles();
    const [major, setMajor] = useState("");
    const [chosen, setChosen] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const createOptionsArray = () => {
        let optionsArray = [];
        for (let i = 0; i < chosen.length; i++) {
            optionsArray.push({ uc: chosen[i], class: null });
        }
        return optionsArray;
    };

    const tabs = Array(10).fill({
        label: "Option",
        options: createOptionsArray(),
    });

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function a11yProps(index) {
        return {
            id: `tab-${index}`,
            key: `tab-${index}`,
            "aria-controls": `tabpanel-${index}`,
        };
    }

    return (
        <div className={classes.container}>
            <CourseSelection
                majorHook={[major, setMajor]}
                chosenHook={[chosen, setChosen]}
                openHook={[modalOpen, setModalOpen]}
            />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch" spacing={4}>
                    <Grid item xs={9}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                variant="fullWidth"
                                value={value}
                                onChange={handleChange}
                                aria-label="TTS Option Tabs"
                            >
                                {tabs.map((tab, tabIdx) => (
                                    <Tab label={`${tab.label} ${tabIdx + 1}`} {...a11yProps(tabIdx)} />
                                ))}
                            </Tabs>
                        </Box>
                        {tabs.map((tab, tabIdx) => (
                            <TabPanel value={value} index={tabIdx}>
                                <ul>
                                    {tab.options.map((option) => (
                                        <li>
                                            {option.uc}: {option.class}
                                        </li>
                                    ))}
                                </ul>
                            </TabPanel>
                        ))}
                    </Grid>

                    <Grid item xs={3}>
                        <Sidebar openModal={() => setModalOpen(true)} courses={chosen} />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TimeTablePage;
