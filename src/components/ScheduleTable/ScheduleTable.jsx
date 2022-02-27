import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Box } from "@mui/material"; 
import ScheduleCell from "./ScheduleCell"; 
import utils from "./ScheduleUtils";

/**
 * This variable stores the first hour to be shown in the schedule table.
 * The last hour is always 24:00.
 */
const firstHour = 8;

/**
 * Titles in the head of the table.
 */
const headElements = ["Horário", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];
/**
 * Maps the days into the matrix indexes.
 */
const weekDay = { Segunda: 1, Terça: 2, Quarta: 3, Quinta: 4, Sexta: 5, Sábado: 6 };

/**
 * Function resposible for building the table.
 * @returns The complete tts table.
 */
const ScheduleTable = ({ selectedClasses }) => {
    return (
        <Table size="small">
            <ScheduleHead />
            <ScheduleBody selectedClasses={selectedClasses} />
        </Table>
    );
};

/**
 * It builds the schedule table head based on the headElements variable.
 * @returns The head for the Schedule table.
 */
const ScheduleHead = () => {
    return (
        <TableHead>
            <TableRow>
                {headElements.map((headName, _) => {
                    return (
                        <TableCell align="center" key={headName}>
                            {headName}
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
};

/**
 * Builds the schedule body considering slots of 30 minutes.
 * @param {} selectedClasses
 */
const ScheduleBody = ({ selectedClasses }) => {
    let subjectsInfo = selectedClasses.reduce((prev, subject) => [...prev, extractSubjectInfo(subject)], []);
    let numberOfRows = utils.hourToIndex("24:00", firstHour) + 1;
    let scheduleMatrix = getScheduleMatrix(numberOfRows, headElements.length, subjectsInfo);
    let schedule = [];
    for (let i = 0; i < numberOfRows; i++) {
        schedule.push(ScheduleBodyLine(i, scheduleMatrix));
    }
    return <TableBody>{schedule}</TableBody>;
};

const ScheduleBodyLine = (row, scheduleMatrix) => {
    return (
        <TableRow key={row}>
            {headElements.map((_, col) => {
                return <ScheduleCell row={row} col={col} scheduleMatrix={scheduleMatrix} firstHour={firstHour}/>;
            })}
        </TableRow>
    );
};

const getScheduleMatrix = (rows, cols, subjectsInfo) => {
    let scheduleMatrix = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(0));
    for (let i = 0; i < subjectsInfo.length; i++) {
        let selectedClass = subjectsInfo[i];
        scheduleMatrix[selectedClass.startHour][selectedClass.day] = selectedClass;
        for (let j = selectedClass.startHour + 1; j < selectedClass.endHour; j++) {
            scheduleMatrix[j][selectedClass.day] = -1;
        }
    }
    return scheduleMatrix;
};

/**
 * IMPORTANT: by the addition of the database this class must be modified.
 * @param {String} subject The description of the subject in the following format: 'id, professor, day, startHour-endHour'
 */
const extractSubjectInfo = (subject) => {
    let splittedTime = subject.time.split("-");
    subject.startHour = utils.hourToIndex(splittedTime[0], firstHour);
    subject.endHour = utils.hourToIndex(splittedTime[1], firstHour);
    subject.day = weekDay[subject.weekday];
    return subject;
};



export default ScheduleTable;
