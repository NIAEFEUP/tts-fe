import React from "react";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from "@mui/material";

/**
 * This variable stores the first hour to be shown in the schedule table.
 * The last hour is always 24:00.
 */
const firstHour = 8;

/**
 * Titles in the head of the table.
 */
const headElements = [
    "Horário",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
];

/**
 * Function resposible for building the table.
 * @returns The complete tts table.
 */
const ScheduleTable = () => {
    return (
        <Table size="small">
            <ScheduleHead />
            <ScheduleBody />
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
 * @param {} classes
 */
const ScheduleBody = () => {
    let numberOfRows = hourToIndex("24:00") + 1;
    let schedule = [];
    for (let i = 0; i < numberOfRows; i++) {
        schedule.push(ScheduleBodyLine(i));
    }
    return (<TableBody>{schedule}</TableBody>);
};

const ScheduleBodyLine = (index) => {
    return (
        <TableRow key={index}>
            {headElements.map((obj, j) => {
                return (
                    <TableCell align="center" key={j}>
                        {j === 0 ? getHourInTable(index) : <p>b</p>}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

// AUX FUNCTIONS =======================================
/**
 * The formated hour given the index in the column.
 * Case it is half an hour it will return nothing, since it should be printed in the table.
 * @param {Integer} index
 * @returns The formated hour.
 */
const getHourInTable = (index) => {
    if (index % 2 === 0) return (<b>{indexToHour(index)}</b>);
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
