import React from "react";
import "../../styles/utilities.css";
import { getDisplayDate, getSchoolYear, getSemester } from "../../utils";
import { styled } from "@mui/material/styles";
import { selectionStyles } from "../../styles/Selection";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { Box, Chip, Paper, Grid, TextField, Stack, Button, Autocomplete } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
}));

export default function Selection() {
    const classes = selectionStyles();
    const courses = [
        { label: "Licenciatura em Engenharia Informática e Computação" },
        { label: "Licenciatura em Engenharia Eletrotécnica e de Computadores" },
        { label: "Licenciatura em Engenharia Mecânica" },
        { label: "Mestrado em Engenharia Informática e Computação" },
    ];

    return (
        <Box className={classes.box} sx={{ flexGrow: 1 }}>
            <div className={classes.headerBox}>
                <div className={classes.flexCenterStart}>
                    <SchoolOutlinedIcon color="secondary" sx={{ height: "auto" }} />
                    <h3 className={classes.header}>Escolha de UCs</h3>
                </div>
                <div className={classes.flexCenterStart}>
                    {/* <Chip size="small" label={getDisplayDate()} sx={{ marginRight: "0.5rem" }} /> */}
                    <Chip color="secondary" size="small" label={getSchoolYear()} sx={{ marginRight: "0.5rem" }} />
                    <Chip color="secondary" size="small" label={getSemester()} />
                </div>
            </div>

            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Item className={classes.item}>
                        <Autocomplete
                            disablePortal
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
                            <Button variant="outlined">Contacte-nos</Button>
                            <Button variant="contained">Confirmar</Button>
                        </Stack>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

Selection.propTypes = {};
