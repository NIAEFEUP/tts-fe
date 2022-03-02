import React from "react";
import ScheduleCell from "./ScheduleCell";
import { hourToIndex, dayToIndex } from "./ScheduleUtils";
import { firstHour } from "./ScheduleTable";


export function SubjectCard({ subjectInfo }) {
    const subject = extractSubjectInfo(subjectInfo);
    const left = dayToIndex(subject.weekday);
    const rowSpan = subject.endHour - subject.startHour; 
    const text = `${subject.acronym} ${subject.class} ${subject.time} ${subject.teacher} ${subject.room}`;
    return <ScheduleCell text={text} left={left} top={subject.startHour} rowSpan={rowSpan} classType="T"/>;
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

