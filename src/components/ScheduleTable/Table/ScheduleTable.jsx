import React from "react";
import ScheduleCell from "./ScheduleCell";
import { hourToIndex, indexToHour } from "./ScheduleUtils";
import { timeTableStyles } from "../../../styles/TimeTable";
import { SubjectCard } from "./SubjectCard";

/**
 * This variable stores the first hour to be shown in the schedule table.
 * The last hour is always 24:00.
 */
export const firstHour = 8;
const headElements = ["", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];

const ScheduleTable = ({ selectedClasses }) => {
    return (
        <>
            <ScheduleHead />
            <ScheduleBody selectedClasses={selectedClasses} />
        </>
    );
};

const ScheduleHead = () => {
    const classes = timeTableStyles();
    return (
        <div className={classes.tableLineContainer}>
            {headElements.map((day, i) => {
                return <ScheduleCell top={0} left={i} text={day} rowSpan={1} />;
            })}
        </div>
    );
};

const ScheduleBody = ({ selectedClasses }) => {
    const classes = timeTableStyles();
    const hourList = getHourList();
    return (
        <div className={classes.tableLineContainer}>
            {selectedClasses.map((info, _) => {
                return <SubjectCard subjectInfo={info} />;
            })}

            {hourList.map((hour, i) => {
                return <ScheduleCell top={i + 1} left={0} rowSpan={1} text={hour} />;
            })}
        </div>
    );
};

const getHourList = () => {
    let numberOfRows = hourToIndex("24:00", firstHour) + 1;
    let hourList = [];
    for (let i = 0; i < numberOfRows; i++) {
        let hour = indexToHour(i, firstHour);
        if (hour.split(":")[1]  === "30") hourList.push("");
        else hourList.push(hour);
    }
    return hourList;
};

export default ScheduleTable;
