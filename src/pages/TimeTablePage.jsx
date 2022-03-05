import React, { useState } from "react";
import Sidebar from "../components/TimeTableScheduler/Sidebar";
import ChooseSchedule from "../components/TimeTableScheduler/ChooseSchedule";
import ChooseCoursesModal from "../components/TimeTableScheduler/ChooseCoursesModal";
import { timeTableStyles } from "../styles/TimeTable";
import { Box, Grid } from "@mui/material";

const TimeTablePage = () => {
    const classes = timeTableStyles();
    const [major, setMajor] = useState("");
    const [chosen, setChosen] = useState([]);
    const [modalOpen, setModalOpen] = useState(true);

    return (
        <div className={`${classes.container} ${modalOpen ? classes.blur : ""}`}>
            <ChooseCoursesModal
                majorHook={[major, setMajor]}
                chosenHook={[chosen, setChosen]}
                openHook={[modalOpen, setModalOpen]}
            />

            <Box sx={{ flexGrow: 1, padding: "2rem", maxWidth: "xl", margin: "auto" }}>
                <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch" spacing={4}>
                    <Grid item xs={12} sm={12} md={8} lg={9} order={{ xs: 2, sm: 2, md: 1, lg: 1 }}>
                        <ChooseSchedule courses={chosen} />
                    </Grid>

                    <Grid item xs={12} sm={12} md={4} lg={3} order={{ xs: 1, sm: 1, md: 2, lg: 2 }}>
                        <Sidebar openModal={() => setModalOpen(true)} courses={chosen} />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TimeTablePage;