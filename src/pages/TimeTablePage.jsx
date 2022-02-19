import React from "react";
import { Grid } from "@mui/material";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    WeekView,
    Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    timetablePage: {
        padding: theme.spacing(3),
    },
    timetableSection: {
        padding: theme.spacing(5),
    },
    editUCsSection: {
        padding: theme.spacing(3),
    },
}));

const TimeTablePage = () => {
    const classes = useStyles();
    return (
        <Grid container className={classes.timetablePage}>
            <Grid item xs={9} className={classes.timetable}>
                <Scheduler>
                    <ViewState />
                    <WeekView
                        startDayHour={8}
                        endDayHour={22}
                        excludedDays={[0]}
                        cellDuration={60}
                    />
                    <Appointments />
                </Scheduler>
            </Grid>
            <Grid item xs={3} className={classes.editUCs}>
                Edit UCs
            </Grid>
        </Grid>
    );
};

export default TimeTablePage;
