import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Box } from "@mui/material";

/**
 * This variable stores the first hour to be shown in the schedule table.
 * The last hour is always 24:00.
 */
const firstHour = 8;

/**
 * Titles in the head of the table.
 */
const headElements = ["Horário", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];
const weekDay = {'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 4, 'Sexta': 5, 'Sábado': 6}; 
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
                {headElements.map((headName, i) => {
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
    let numberOfRows = hourToIndex("24:00") + 1;
    let scheduleMatrix = getScheduleMatrix(numberOfRows, headElements.length, subjectsInfo);
    let schedule = [];
    for (let i = 0; i < numberOfRows; i++) {
        schedule.push(ScheduleBodyLine(i, scheduleMatrix));
    }
    return <TableBody>{schedule}</TableBody>;
};

const ScheduleBodyLine = (index, scheduleMatrix) => {
    return (
        <TableRow key={index}>
            {headElements.map((obj, j) => {
                let matrixValue = scheduleMatrix[index][j];
                if (matrixValue === 0) {
                    return (
                        <TableCell align="center" key={j}>
                            {j === 0 ? getHourInTable(index) : <p> </p>}
                        </TableCell>
                    );
                } else if (matrixValue !== -1) {
                    let rowSpan = matrixValue.endHour - matrixValue.startHour;
                    return (
                        <TableCell align="center" key={j} rowSpan={rowSpan} sx={{borderRadius: 2, backgroundColor: "primary.main", zIndex:2}}>
                            <ScheduleCard subjectInfo={scheduleMatrix[index][j]} />
                        </TableCell>
                    );
                }
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

const ScheduleCard = ({ subjectInfo }) => {
    return (
        <Box sx={{ p: 2,  color: "white", fontWeight: "bold",  }}>
            {subjectInfo.acronym} <br/> 
            {subjectInfo.class}<br/> 
            {subjectInfo.name}<br/> 
            {subjectInfo.time} <br/> 
            {subjectInfo.teacher}  <br/> 
            {subjectInfo.room} <br/> 
        </Box>
    );
};

/**
 * IMPORTANT: by the addition of the database this class must be modified.
 * @param {String} subject The description of the subject in the following format: 'id, professor, day, startHour-endHour'
 */
const extractSubjectInfo = (subject) => {  
    let splittedTime = subject.time.split("-"); 
    subject.startHour = hourToIndex(splittedTime[0]); 
    subject.endHour = hourToIndex(splittedTime[1]); 
    subject.day = weekDay[subject.weekday];
    return subject; 
};

// AUX FUNCTIONS =======================================
/**
 * The formated hour given the index in the column.
 * Case it is half an hour it will return nothing, since it should be printed in the table.
 * @param {Integer} index
 * @returns The formated hour.
 */
const getHourInTable = (index) => {
    if (index % 2 === 0) return <b>{indexToHour(index)}</b>;
};

/**
 *
 * @param {String} hour Hour string in the format "hh:mm". Attention, the fields of minutes can only be "30" or "00".
 * Case the minute field doesn't obey the contraint cited above, an error will be displayed in the command line.
 * @returns The index of the hour case valid. -1 otherwise.
 */
const hourToIndex = (hour) => {
    let splitedHour = hour.split(":");
    let hourField = splitedHour[0],
        minuteField = splitedHour[1];

    if (minuteField === "00" || minuteField === "30") {
        let isHalfHour = minuteField == "30" ? 1 : 0;
        return (parseInt(hourField) - firstHour) * 2 + isHalfHour;
    }

    console.error(`Minutes field not in the correct format: ${minuteField}`);
    return -1;
};

const indexToHour = (index) => {
    let hour = Math.floor(index / 2 + firstHour)
        .toString()
        .padStart(2, "0");
    let minutes = index % 2 === 0 ? "00" : "30";
    return hour + ":" + minutes;
};

export default ScheduleTable;
