import React from "react";
import { headElements } from "../ScheduleUtils";
import { timeTableStyles } from "../../../../styles/TimeTable";

export function Weekdays() {
    let weekdayContainer = timeTableStyles().weekdayContainer;
    return (
        <div className={weekdayContainer}>
            {headElements.map((day, left) => {
                const weekdayCell = timeTableStyles({ left }).weekdayCell;
                return <div className={weekdayCell}>{day}</div>;
            })}
        </div>
    );
}
