import React, { useState } from "react";
import TabPanel from "../Common/TabPanel";
import { Box, Tabs, Tab } from "@mui/material";

export default function ChooseSchedule({ chosen }) {
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
        <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="TTS Option Tabs">
                    {tabs.map((tab, tabIdx) => (
                        <Tab label={`${tab.label} ${tabIdx + 1}`} {...a11yProps(tabIdx)} />
                    ))}
                </Tabs>
            </Box>
            {tabs.map((tab, tabIdx) => (
                <TabPanel value={value} index={tabIdx} key={`tabpanel-${tabIdx}`}>
                    {tab.options.map((option, optionIdx) => (
                        <span key={`option-${tabIdx}-${optionIdx}`}>
                            {option.uc}: {option.class}
                        </span>
                    ))}
                </TabPanel>
            ))}
        </>
    );
}
