import "../../styles/utilities.css";
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { timeTableStyles } from "../../styles/TimeTable";
import { initializeCourses, majors, getSchoolYear, getSemester } from "../../utils";
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
} from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
}));

export default function ChooseCoursesModal({ majorHook, chosenHook, openHook }) {
    const classes = timeTableStyles();
    const coursesInit = initializeCourses();

    const [major, setMajor] = majorHook;
    const [chosen, setChosen] = chosenHook;
    const [modalOpen, setModalOpen] = openHook;
    const [courses, setCourses] = useState(coursesInit);

    const [extraUcs, setExtraUcs] = useState(false);
    const [bannerOpen, setBannerOpen] = useState(true);
    const [nextAvailable, setNextAvailable] = useState(false);
    const [bannerSeverity, setBannerSeverity] = useState("info");

    useEffect(() => {
        if (chosen.length > 0) {
            setNextAvailable(true);
            setBannerSeverity("success");
        } else {
            setNextAvailable(false);
            setBannerSeverity("info");
        }
    }, [chosen, courses]);

    const handleCheck = (value, groupIndex, ucIndex) => {
        // FIXME: Optimize setCourses (weird setState [groupIndex].checked[ucIndex])
        let newCourses = [];
        for (let i = 0; i < courses.length; i++) {
            if (i !== groupIndex) newCourses.push(courses[i]);
            else {
                let newChecked = [];
                for (let j = 0; j < courses[i].ucs.length; j++) {
                    if (j === ucIndex) newChecked.push(value);
                    else newChecked.push(courses[i].checked[j]);
                }
                newCourses.push({ year: courses[i].year, ucs: courses[i].ucs, checked: newChecked });
            }
        }
        setCourses(newCourses);

        let newChosen = chosen;
        if (value) newChosen.push(courses[groupIndex].ucs[ucIndex]);
        else newChosen = newChosen.filter((item) => item !== courses[groupIndex].ucs[ucIndex]);
        setChosen(newChosen);
    };

    const handleCheckAll = (value, index) => {
        let newCourses = [];
        let newChosen = chosen;

        for (let i = 0; i < courses.length; i++) {
            if (i !== index) {
                newCourses.push(courses[i]);
            } else {
                if (value) newChosen = [...new Set([...chosen, ...courses[i].ucs])];
                else newChosen = newChosen.filter((item) => !courses[i].ucs.includes(item));
                newCourses.push({
                    year: courses[i].year,
                    ucs: courses[i].ucs,
                    checked: Array(courses[index].ucs.length).fill(value),
                });
            }
        }

        setCourses(newCourses);
        setChosen(newChosen);
    };

    const handleClose = () => {
        if (nextAvailable) setModalOpen(false);
        else {
            setBannerOpen(true);
            switch (bannerSeverity) {
                case "info":
                    setBannerSeverity("warning");
                    break;
                case "warning":
                    setBannerSeverity("error");
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
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
                            <Collapse in={bannerOpen}>
                                <Alert
                                    severity={bannerSeverity}
                                    size="small"
                                    style={{ padding: "0 0.75rem" }}
                                    action={
                                        <IconButton
                                            aria-label="close"
                                            color="inherit"
                                            size="small"
                                            onClick={() => {
                                                setBannerOpen(false);
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
                    <Grid item xs={12} sm={12} md={12} xl={12}>
                        <Item className={classes.item}>
                            <Autocomplete
                                // FIXME: Empty string passed to getElementById().
                                // FIXME: None of the options match with `""`. Use `isOptionEqualToValue` to customize the equality test.
                                id="course-selection"
                                className="bg-white"
                                options={majors}
                                value={major}
                                onChange={(event, newMajor) => {
                                    setMajor(newMajor);
                                }}
                                renderInput={(params) => <TextField {...params} placeholder="Curso" />}
                                ListboxProps={{ style: { maxHeight: "15rem", fontSize: "smaller" } }}
                            />
                        </Item>
                    </Grid>

                    {extraUcs ? (
                        <Grid item xs={12}>
                            <Item className={classes.item}>
                                <Stack spacing={1} direction="row" justifyContent="space-between">
                                    <Autocomplete
                                        multiple
                                        fullWidth
                                        size="small"
                                        id="tags-outlined"
                                        className="bg-white"
                                        options={["EPE", "ABC", "IDE"]}
                                        getOptionLabel={(option) => option}
                                        defaultValue={[]}
                                        filterSelectedOptions
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Selecione unidades curriculares externas"
                                            />
                                        )}
                                        ListboxProps={{ style: { maxHeight: "15rem", fontSize: "smaller" } }}
                                    />
                                    <Button size="small" variant="text" onClick={() => setExtraUcs(false)}>
                                        <CloseIcon />
                                    </Button>
                                </Stack>
                            </Item>
                        </Grid>
                    ) : null}

                    {/* Choose Courses */}
                    {majors.indexOf(major) !== -1 ? (
                        <Grid item xs={12}>
                            <Item className={classes.item}>
                                <Stack spacing={4} direction="row" justifyContent="center">
                                    {courses.map((entry, entryIdx) => {
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
                                                <Grid
                                                    item
                                                    sx={{ ml: 3 }}
                                                    display="grid"
                                                    gridTemplateRows="repeat(6, minmax(0, 1fr))"
                                                    gridAutoFlow="column"
                                                >
                                                    {ucs.map((uc, ucIdx) => (
                                                        <Box
                                                            gridColumn="span 1"
                                                            key={`G-${entryIdx}-Y${year}-${uc}-${ucIdx}`}
                                                        >
                                                            <FormControlLabel
                                                                label={uc}
                                                                control={
                                                                    <Checkbox
                                                                        size="small"
                                                                        sx={{ p: 0.4 }}
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
                                                </Grid>
                                            </div>
                                        );
                                    })}
                                </Stack>
                            </Item>
                        </Grid>
                    ) : null}

                    {/* Footer */}
                    <Grid item xs={12} sx={{ mt: 3 }}>
                        <Item className={classes.item}>
                            <Stack spacing={2} direction="row" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    color="dark"
                                    href="https://ni.fe.up.pt/#contacts"
                                    target="_blank"
                                >
                                    Contacte-nos
                                </Button>

                                <Stack spacing={2} direction="row" justifyContent="space-between">
                                    <Button variant="text" onClick={() => setExtraUcs(true)} endIcon={<AddIcon />}>
                                        UCs fora do curso
                                    </Button>
                                    {nextAvailable ? (
                                        <Button
                                            variant="contained"
                                            onClick={() => setModalOpen(false)}
                                            endIcon={<CheckIcon />}
                                        >
                                            Confirmar
                                        </Button>
                                    ) : null}
                                </Stack>
                            </Stack>
                        </Item>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
