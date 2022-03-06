import React, { useState } from "react";
import TabPanel from "../Common/TabPanel";
import { Box, Tabs, Tab } from "@mui/material";

export default function ChooseSchedule({ courses }) {
    const createOptionsArray = () => {
        let optionsArray = [];
        for (let i = 0; i < courses.length; i++) {
            optionsArray.push({ uc: courses[i], class: null });
        }
        return optionsArray;
    };

    const tabs = Array(10).fill({
        label: "Schedule #",
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
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider", margin: "auto" }}>
                <Tabs value={value} variant="scrollable" onChange={handleChange} aria-label="TTS Option Tabs">
                    {tabs.map((tab, tabIdx) => (
                        <Tab label={`${tab.label}${tabIdx + 1}`} {...a11yProps(tabIdx)} />
                    ))}
                </Tabs>
            </Box>

            {tabs.map((tab, tabIdx) => (
                <TabPanel value={value} index={tabIdx} key={`tabpanel-${tabIdx}`}>
                    <ul>
                        {tab.options.map((option, optionIdx) => (
                            <li key={`option-${tabIdx}-${optionIdx}`}>
                                {option.uc.acronym}: {option.class}
                            </li>
                        ))}
                    </ul>
                </TabPanel>
            ))}
        </>
    );
}
