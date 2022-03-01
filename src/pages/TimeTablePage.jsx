import React, { useState } from "react";
import { timeTableStyles } from "../styles/TimeTable";
import Sidebar from "../components/TimeTableScheduler/Sidebar";
import Selection from "../components/TimeTableScheduler/Selection";
import { Box, Grid, Card } from "@mui/material";

const TimeTablePage = () => {
    const classes = timeTableStyles();
    const [open, setOpen] = useState(false);
    const [coursesPicked, setCoursesPicked] = useState([]);

    return (
        <div className={classes.container}>
            <Selection openHook={[open, setOpen]} coursesPicked={coursesPicked} setCoursesPicked={setCoursesPicked} />

            <Box sx={{ flexGrow: 1 }}>
                <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch" spacing={3}>
                    <Grid item xs={9}>
                        <Card className={classes.card}>Schedule area</Card>
                    </Grid>

                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            <Sidebar openModal={() => setOpen(true)} coursesPicked={coursesPicked} />
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TimeTablePage;
