import "../styles/utilities.css";
import React, { useState, useEffect } from "react";
import Sidebar from "../components/TimeTableScheduler/Sidebar";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { timeTableStyles } from "../styles/TimeTable";
import { initialSelectedCourses, majors, getSchoolYear, getSemester } from "../utils";
import { styled } from "@mui/material/styles";
import {
    Box,
    Chip,
    Grid,
    Modal,
    Alert,
    Stack,
    Paper,
    Button,
    Checkbox,
    Collapse,
    TextField,
    Autocomplete,
    FormControlLabel,
    Card,
} from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
}));

const TimeTablePage = () => {
    const classes = timeTableStyles();
    const [open, setOpen] = useState(false);
    const [course, setCourse] = useState("");
    const [infoOpen, setInfoOpen] = useState(true);
    const [selected, setSelected] = useState(initialSelectedCourses());
    const [coursesPicked, setCoursesPicked] = useState([]);
    const [nextAvailable, setNextAvailable] = useState(false);

    useEffect(() => {
        if (coursesPicked.length > 0) setNextAvailable(true);
        else setNextAvailable(false);
    }, [coursesPicked, selected]);

    const handleCheck = (value, groupIndex, ucIndex) => {
        let newPicked = coursesPicked;
        let newSelected = [];

        for (let i = 0; i < selected.length; i++) {
            if (i !== groupIndex) newSelected.push(selected[i]);
            else {
                let newChecked = [];
                for (let j = 0; j < selected[i].ucs.length; j++) {
                    if (j === ucIndex) {
                        newChecked.push(value);
                        if (value) newPicked.push(selected[i].ucs[j]);
                        else {
                            newPicked = newPicked.filter((item) => item !== selected[i].ucs[j]);
                        }
                    } else {
                        newChecked.push(selected[i].checked[j]);
                    }
                }

                newSelected.push({
                    year: selected[i].year,
                    ucs: selected[i].ucs,
                    checked: newChecked,
                });
            }
        }

        setSelected(newSelected);
        setCoursesPicked(newPicked);
    };

    const handleCheckAll = (value, index) => {
        let newSelected = [];
        let newPicked = coursesPicked;

        for (let i = 0; i < selected.length; i++) {
            if (i !== index) {
                newSelected.push(selected[i]);
            } else {
                if (value) newPicked = [...new Set([...coursesPicked, ...selected[i].ucs])];
                else newPicked = newPicked.filter((item) => !selected[i].ucs.includes(item));
                newSelected.push({
                    year: selected[i].year,
                    ucs: selected[i].ucs,
                    checked: Array(selected[index].ucs.length).fill(value),
                });
            }
        }

        setSelected(newSelected);
        setCoursesPicked(newPicked);
    };

    return (
        <div className={classes.container}>
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

                        {/* Course Autocomplete */}
                        <Grid item xs={12} sm={12} md={12} xl={12} sx={{ mb: 2 }}>
                            <Item className={classes.item}>
                                <Autocomplete
                                    // FIXME: Empty string passed to getElementById().
                                    // FIXME: None of the options match with `""`. Use `isOptionEqualToValue` to customize the equality test.
                                    id="course-selection"
                                    className="bg-white"
                                    options={majors}
                                    value={course}
                                    onChange={(event, newCourse) => {
                                        setCourse(newCourse);
                                    }}
                                    renderInput={(params) => <TextField {...params} placeholder="Curso" />}
                                />
                            </Item>
                        </Grid>

                        {/* Choose Courses */}
                        {majors.indexOf(course) !== -1 ? (
                            <Grid item xs={12}>
                                <Item className={classes.item}>
                                    <Stack spacing={2} direction="row" justifyContent="center">
                                        {selected.map((entry, entryIdx) => {
                                            const ucs = entry.ucs;
                                            const year = entry.year;
                                            const checked = entry.checked;

                                            return (
                                                <div key={`ucs-group-${entryIdx}`}>
                                                    {/* Parent checkbox */}
                                                    <FormControlLabel
                                                        label={`${year}º Ano`}
                                                        control={
                                                            <Checkbox
                                                                onChange={(event) =>
                                                                    handleCheckAll(event.target.checked, entryIdx)
                                                                }
                                                                checked={checked.every((element) => element === true)}
                                                                indeterminate={
                                                                    checked.includes(true) &&
                                                                    !checked.every((element) => element === true)
                                                                }
                                                            />
                                                        }
                                                    />

                                                    {/* Children checkboxes */}
                                                    <Box
                                                        display="grid"
                                                        gridTemplateColumns="repeat(3, 1fr)"
                                                        gap={0}
                                                        sx={{ ml: 3 }}
                                                    >
                                                        {ucs.map((uc, ucIdx) => (
                                                            <Box
                                                                gridColumn="span 1"
                                                                key={`G-${entryIdx}-Y${year}S-${2}-${uc}-${ucIdx}`}
                                                            >
                                                                <FormControlLabel
                                                                    label={uc}
                                                                    control={
                                                                        <Checkbox
                                                                            size="small"
                                                                            sx={{ p: 0.5 }}
                                                                            checked={checked[ucIdx]}
                                                                            onChange={(event) =>
                                                                                handleCheck(
                                                                                    event.target.checked,
                                                                                    entryIdx,
                                                                                    ucIdx
                                                                                )
                                                                            }
                                                                        />
                                                                    }
                                                                />
                                                            </Box>
                                                        ))}
                                                    </Box>
                                                </div>
                                            );
                                        })}
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
                                        <Button variant="contained" onClick={() => setOpen(false)}>
                                            Confirmar
                                        </Button>
                                    ) : null}
                                </Stack>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>

            <Box sx={{ flexGrow: 1 }}>
                <Grid container direction="row" justifyContent="space-evenly" alignItems="stretch" spacing={3}>
                    <Grid item xs={9}>
                        <Card className={classes.card}>Schedule area</Card>
                    </Grid>

                    <Grid item xs={3}>
                        <Card className={classes.card}>
                            <Sidebar openModal={() => setOpen(true)} courses={coursesPicked} />
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
};

export default TimeTablePage;
