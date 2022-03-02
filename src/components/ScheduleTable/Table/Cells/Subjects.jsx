import React from "react";
import { hourToIndex, dayToIndex, firstHour } from "../ScheduleUtils";
import { timeTableStyles } from "../../../../styles/TimeTable";

export function Subjects({ selectedClasses }) {
    return selectedClasses.map((info, _) => {
        return <Subject subjectInfo={info} />;
    });
}
function Subject({ subjectInfo }) {
    const subject = extractSubjectInfo(subjectInfo);
    const left = dayToIndex(subject.weekday);
    const rowSpan = subject.endHour - subject.startHour;
    const text = `${subject.acronym} ${subject.class} ${subject.time} ${subject.teacher} ${subject.room}`;
    const top = subject.startHour;
    const classType = "T";
    const classes = timeTableStyles({ left, top, rowSpan, classType });
    return <div className={classes.subjectCell}>{text}</div>;
}

/**
 * IMPORTANT: by the addition of the database this class must be modified.
 * @param {String} subject The description of the subject in the following format: 'id, professor, day, startHour-endHour'
 */
const extractSubjectInfo = (subject) => {
    let splittedTime = subject.time.split("-");
    subject.startHour = hourToIndex(splittedTime[0], firstHour);
    subject.endHour = hourToIndex(splittedTime[1], firstHour);
    subject.day = dayToIndex[subject.weekday];
    return subject;
};
