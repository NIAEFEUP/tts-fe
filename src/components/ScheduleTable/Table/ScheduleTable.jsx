import React from "react";
import { getHourList, headElements } from "./ScheduleUtils";
import { timeTableStyles } from "../../../styles/TimeTable";
import { SubjectCard, Subjects } from "./Cells/Subjects";
import { Hours } from "./Cells/Hour";
import { Weekdays } from "./Cells/Weekdays";

const ScheduleTable = ({ selectedClasses }) => {
    return (
        <>
            <Weekdays />
            <ScheduleBody selectedClasses={selectedClasses} />
        </>
    );
};



const ScheduleBody = ({ selectedClasses }) => {
    const classes = timeTableStyles();
    const hourList = getHourList();
    const weekDays = headElements;
    let borderTop = ""; 
    
    return (
        <div className={classes.positionRelative}>
            {hourList.map((hour, top) => {
                return weekDays.map((day, left) => {
                    if (left !== 0 && top !== 0) { 
                        borderTop = "solid";
                        let divClass = timeTableStyles({ top, left, borderTop });
                        return <div className={divClass.border}></div>;
                    } else return <></>
                });
            })} 
            <Subjects selectedClasses={selectedClasses}/>
            <Hours/>
        </div>
    );
};

export default ScheduleTable;
