import React, { useEffect, useState } from "react";
import "../../styles/utilities.css";
import { semesterUCs, courses, getSchoolYear, getSemester } from "../../utils";
import { styled } from "@mui/material/styles";
import { selectionStyles } from "../../styles/Selection";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { Collapse, Box, Alert, Chip, Paper, Grid, TextField, Stack, Button, Autocomplete, Modal } from "@mui/material";
import CourseCheckboxes from "./CourseCheckboxes";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
}));

export default function Selection({ openHook, coursesPicked, setCoursesPicked }) {
    const classes = selectionStyles();
    const [open, setOpen] = openHook;
    const [course, setCourse] = useState("");
    const [infoOpen, setInfoOpen] = useState(true);
    const [nextAvailable, setNextAvailable] = useState(false);

    useEffect(() => {
        if (courses.indexOf(course) !== -1 && coursesPicked.length > 0) setNextAvailable(true);
        else setNextAvailable(false);
    }, [course, coursesPicked]);

    return (
        <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box className={classes.box} sx={{ flexGrow: 1 }}>
                {/* Header */}
                <div className={classes.headerBox}>
                    <div className={classes.flexCenterStart}>
                        <SchoolOutlinedIcon color="primary" sx={{ height: "auto" }} />
                        <h3 className={classes.header}>Escolha de UCs</h3>
                    </div>
                    <div className={classes.flexCenterStart}>
                        <Chip label={getSchoolYear()} sx={{ marginRight: "0.5rem", fontSize: "large" }} />
                        <Chip label={getSemester()} sx={{ fontSize: "large" }} />
                    </div>
                </div>

                <Grid container spacing={2}>
                    {/* Info Banner */}
                    <Grid item xs={12} sm={12} md={12} xl={12}>
                        <Item className={classes.item}>
                            <Collapse in={infoOpen}>
                                <Alert
                                    severity="info"
                                    size="small"
                                    style={{ padding: "0 0.75rem" }}
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setInfoOpen(false);
                                            }}
                                        >
                                            <CloseIcon fontSize="inherit" />
                                        </IconButton>
                                    }
                                >
                                    Por favor selecione o seu curso principal, seguido das UCs pretendidas.
                                </Alert>
                            </Collapse>
                        </Item>
                    </Grid>

                    {/* Autocomplete */}
                    <Grid item xs={12} sm={12} md={12} xl={12} sx={{ mb: 2 }}>
                        <Item className={classes.item}>
                            <Autocomplete
                                // FIXME: Empty string passed to getElementById().
                                id="course-selection"
                                className="bg-white"
                                options={courses}
                                value={course}
                                onChange={(event, newCourse) => {
                                    setCourse(newCourse);
                                }}
                                isOptionEqualToValue={(option, value) => {
                                    return "" === value.label || option.label === value.label;
                                }}
                                renderInput={(params) => <TextField {...params} placeholder="Curso" />}
                            />
                        </Item>
                    </Grid>

                    {/* Choose Courses */}
                    {courses.indexOf(course) !== -1 ? (
                        <Grid item xs={12}>
                            <Item className={classes.item}>
                                <Stack spacing={2} direction="row" justifyContent="center">
                                    {semesterUCs
                                        .filter((entry) => entry.semester === 2)
                                        .map((entry, entryIdx) => (
                                            <CourseCheckboxes
                                                key={`select-${entryIdx}`}
                                                ucs={entry.ucs}
                                                year={entry.year}
                                                semester={entry.semester}
                                                coursesPicked={coursesPicked}
                                                setCoursesPicked={setCoursesPicked}
                                            />
                                        ))}
                                </Stack>
                            </Item>
                        </Grid>
                    ) : null}

                    {/* Footer */}
                    <Grid item xs={12}>
                        <Item className={classes.item}>
                            <Stack spacing={2} direction="row" justifyContent="space-between">
                                <Button variant="outlined" href="https://ni.fe.up.pt/#contacts" target="_blank">
                                    Contacte-nos
                                </Button>
                                {nextAvailable ? (
                                    <Button
                                        variant="contained"
                                        onClick={() => {
                                            if (nextAvailable) setOpen(false);
                                        }}
                                    >
                                        Confirmar
                                    </Button>
                                ) : null}
                            </Stack>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}

Selection.propTypes = {};
