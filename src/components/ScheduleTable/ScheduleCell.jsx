import React from "react";
import ScheduleCard from "./ScheduleCard";
import { TableCell } from "@mui/material";
import utils from "./ScheduleUtils";

export default function ScheduleCell({ scheduleMatrix, row, col, firstHour }) {
    let matrixValue = scheduleMatrix[row][col];
    if (matrixValue === 0) {
        return <EmptyTableCell row={row} col={col} firstHour={firstHour} />;
    } else if (matrixValue !== -1) {
        let rowSpan = matrixValue.endHour - matrixValue.startHour;
        return <ScheduleTableCell rowSpan={rowSpan} row={row} col={col} scheduleMatrix={scheduleMatrix} />;
    } 
    return <></>;
}

const EmptyTableCell = ({ row, col, firstHour }) => {
    return <TableCell align="center">{col === 0 ? utils.getHourInTable(row, firstHour) : <p> </p>}</TableCell>;
};

const ScheduleTableCell = ({ rowSpan, row, col, scheduleMatrix }) => {
    return (
        <TableCell
            align="center"
            key={col}
            rowSpan={rowSpan}
            sx={{ borderRadius: 2, backgroundColor: "primary.main", zIndex: 2 }}
        >
            <ScheduleCard subjectInfo={scheduleMatrix[row][col]} />
        </TableCell>
    );
};
