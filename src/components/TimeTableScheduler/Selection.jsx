import React, { useState } from "react";
import "../../styles/utilities.css";
import { getDisplayDate, getSchoolYear, getSemester } from "../../utils";
import { styled } from "@mui/material/styles";
import { selectionStyles } from "../../styles/Selection";
import { Box, Alert, Chip, Paper, Grid, TextField, Stack, Button, Autocomplete, Modal } from "@mui/material";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
}));

export default function Selection() {
    const classes = selectionStyles();
    const [alert, setAlert] = useState(false);
    const [open, setOpen] = useState(false);
    const [course, setCourse] = useState("");
    const [inputCourse, setInputCourse] = React.useState("");
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        if (course !== "") setOpen(false);
        else {
            setAlert(true);
            setTimeout(() => {
                setAlert(false);
            }, 5000);
        }
    };

    const courses = [
        { label: "Mestrado em Planeamento e Projecto Urbano" },
        { label: "Programa de Doutoramento em Arquitetura" },
        { label: "Programa Doutoral em Segurança e Saúde Ocupacionais" },
        { label: "Licenciatura em Engenharia Informática e Computação" },
        { label: "Licenciatura em Engenharia Eletrotécnica e de Computadores" },
        { label: "Licenciatura em Engenharia Mecânica" },
        { label: "Mestrado em Engenharia Informática e Computação" },
    ];

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen} className={classes.flexCenterStart}>
                <DashboardCustomizeRoundedIcon color="secondary" sx={{ height: "auto", marginRight: "0.5rem" }} />
                <span>Editar UCs</span>
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={classes.box} sx={{ flexGrow: 1 }}>
                    <div className={classes.headerBox}>
                        <div className={classes.flexCenterStart}>
                            <SchoolOutlinedIcon color="secondary" sx={{ height: "auto" }} />
                            <h3 className={classes.header}>Escolha de UCs</h3>
                        </div>
                        <div className={classes.flexCenterStart}>
                            <Chip size="small" label={getDisplayDate()} sx={{ marginRight: "0.5rem" }} />
                            <Chip
                                color="secondary"
                                size="small"
                                label={getSchoolYear()}
                                sx={{ marginRight: "0.5rem" }}
                            />
                            <Chip color="secondary" size="small" label={getSemester()} />
                        </div>
                    </div>

                    <Grid container spacing={2}>
                        {alert ? (
                            <Grid item xs={12} sm={12} md={12} xl={12}>
                                <Item className={classes.item}>
                                    <Alert severity="warning">Please select course before moving on!</Alert>
                                </Item>
                            </Grid>
                        ) : null}

                        <Grid item xs={12} sm={12} md={12} xl={12}>
                            <Item className={classes.item}>
                                <Autocomplete
                                    value={course}
                                    onChange={(event, newCourse) => {
                                        setCourse(newCourse);
                                    }}
                                    inputValue={inputCourse}
                                    onInputChange={(event, newInputCourse) => {
                                        setInputCourse(newInputCourse);
                                    }}
                                    className="bg-white"
                                    id="course-selection"
                                    options={courses}
                                    renderInput={(params) => <TextField {...params} label="Curso" />}
                                />
                            </Item>
                        </Grid>

                        <Grid item xs={12}>
                            <Item className={classes.item}>
                                <Stack spacing={2} direction="row" justifyContent="space-between">
                                    <Button variant="outlined" href="https://ni.fe.up.pt/#contacts" target="_blank">
                                        Contacte-nos
                                    </Button>
                                    <Button onClick={handleClose} variant="contained">
                                        Confirmar
                                    </Button>
                                </Stack>
                            </Item>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}

Selection.propTypes = {};
