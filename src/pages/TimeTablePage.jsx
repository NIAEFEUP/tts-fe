import React from "react";
import Selection from "../components/Selection";
import { timeTableStyles } from "../styles/TimeTable";

const TimeTablePage = () => {
    const classes = timeTableStyles();

    return (
        <div className={classes.container}>
            <Selection />
        </div>
    );
};

export default TimeTablePage;
