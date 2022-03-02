import React from "react";
import ScheduleCell from "./ScheduleCell";
import { getHourList, headElements } from "./ScheduleUtils";
import { timeTableStyles } from "../../../styles/TimeTable";
import { SubjectCard } from "./SubjectCard";
import { Hours } from "./Cells/Hour";

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
    const weekDays = headElements;
    let borderTop = ""; 
    return (
        <div className={classes.tableLineContainer}>
            {hourList.map((hour, top) => {
                return weekDays.map((day, left) => {
                    if (left !== 0 && top !== 0) { 
                        if (hour === "") borderTop = "0"; 
                        else borderTop = "solid";
                        let divClass = timeTableStyles({ top, left, borderTop });
                        return <div className={divClass.borderHalfHour}></div>;
                    } return <></>
                });
            })}
            {selectedClasses.map((info, _) => {
                return <SubjectCard subjectInfo={info} />;
            })}
            <Hours/>
            
        </div>
    );
};

export default ScheduleTable;
