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
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className={classes.container}>
            <ChooseCoursesModal
                majorHook={[major, setMajor]}
                chosenHook={[chosen, setChosen]}
                openHook={[modalOpen, setModalOpen]}
            />

            <Box sx={{ flexGrow: 1, padding: "2rem" }}>
                <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch" spacing={4}>
                    <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                        <ChooseSchedule chosen={chosen} />
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                        <Sidebar openModal={() => setModalOpen(true)} courses={chosen} />
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TimeTablePage;
