import "../styles/utilities.css";
import React, { useState } from "react";
import Sidebar from "../components/TimeTableScheduler/Sidebar";
import CourseSelection from "../components/TimeTableScheduler/CourseSelection";
import { timeTableStyles } from "../styles/TimeTable";
import { Box, Grid, Card } from "@mui/material";

const TimeTablePage = () => {
    const classes = timeTableStyles();
    const [major, setMajor] = useState("");
    const [chosen, setChosen] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div className={classes.container}>
            <CourseSelection
                majorHook={[major, setMajor]}
                chosenHook={[chosen, setChosen]}
                openHook={[modalOpen, setModalOpen]}
            />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch" spacing={3}>
                    <Grid item xs={9}>
                        <Card className={classes.card}>Schedule area</Card>
                    </Grid>

                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            <Sidebar openModal={() => setModalOpen(true)} courses={chosen} />
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TimeTablePage;
