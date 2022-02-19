import React from "react";
import { Grid } from "@mui/material";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
    Scheduler,
    WeekView,
    Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import { makeStyles } from "@mui/styles";
import { TimetableConstants } from "../../utils/Timetable/TimetableConstants";

const useStyles = makeStyles((theme) => ({
    timetableSection: {
        // padding: theme.spacing(5),
    },
}));

const Timetable = () => {
    const classes = useStyles();
    return (
        <Grid item xs={12} sm={9} className={classes.timetable}>
            <Scheduler>
                <ViewState />
                <WeekView
                    startDayHour={TimetableConstants.startDayHour}
                    endDayHour={TimetableConstants.endDayHour}
                    excludedDays={[
                        TimetableConstants.weekdays.Sunday,
                        TimetableConstants.weekdays.Saturday,
                    ]}
                    cellDuration={TimetableConstants.cellDurationMinutes}
                />
                <Appointments />
            </Scheduler>
        </Grid>
    );
};

export default Timetable;
