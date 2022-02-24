import * as React from "react";
import { styled } from "@mui/material/styles";
import {
    Box,
    Grid,
    Paper,
    TextField,
    Stack,
    Button,
    Autocomplete,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import { selectionStyles } from "../styles/components/Selection";

const semesters = [1, 2];
const schoolyears = ["2020/2021", "2021/2022", "2022/2023"];

const universities = [
    { label: "Faculdade de Engenharia da Universidade do Porto" },
    { label: "Faculdade de Ciêcnias da Universidade do Porto" },
    { label: "Faculdade de Desporto da Universidade do Porto" },
    { label: "Faculdade de Farmácia da Universidade do Porto" },
];

const courses = [
    { label: "Licenciatura em Engenharia Informática e Computação" },
    { label: "Licenciatura em Engenharia Eletrotécnica e de Computadores" },
    { label: "Licenciatura em Engenharia Mecânica" },
    { label: "Mestrado em Engenharia Informática e Computação" },
];

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
}));

export default function Selection() {
    const [semester, setSemester] = React.useState("");
    const [schoolyear, setSchoolyear] = React.useState("");

    const handleChangeSchoolyear = (event) => {
        setSchoolyear(event.target.value);
    };

    const handleChangeSemester = (event) => {
        setSemester(event.target.value);
    };

    const classes = selectionStyles();

    return (
        <Box className={classes.box} sx={{ flexGrow: 1 }}>
            <h1 className={classes.header}>Escolha de UCs</h1>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Item className={classes.item}>
                        <Autocomplete
                            disablePortal
                            id="university-selection"
                            className={classes.autocomplete}
                            options={universities}
                            renderInput={(params) => (
                                <TextField {...params} label="Faculdade" />
                            )}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={12} md={12} xl={12}>
                    <Item className={classes.item}>
                        <Autocomplete
                            disablePortal
                            id="course-selection"
                            options={courses}
                            renderInput={(params) => (
                                <TextField {...params} label="Curso" />
                            )}
                        />
                    </Item>
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={6}>
                    <Item className={classes.item}>
                        <FormControl fullWidth>
                            <InputLabel id="schoolyear-selection-select-label">
                                Ano Letivo
                            </InputLabel>
                            <Select
                                labelId="schoolyear-selection-select-label"
                                id="schoolyear-selection"
                                label="Ano Letivo"
                                className={classes.menuItem}
                                value={schoolyear}
                                onChange={(e) => handleChangeSchoolyear(e)}
                            >
                                {schoolyears.map((item, index) => (
                                    <MenuItem
                                        value={item}
                                        key={`schoolyear-${index}`}
                                    >
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Item>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    xl={6}
                    className={classes.spacing}
                >
                    <Item className={classes.item}>
                        <FormControl fullWidth>
                            <InputLabel id="semester-selection-select-label">
                                Semestre
                            </InputLabel>
                            <Select
                                labelId="semester-selection-select-label"
                                label="Semestre"
                                id="semester-selection"
                                className={classes.menuItem}
                                value={semester}
                                onChange={(e) => handleChangeSemester(e)}
                            >
                                {semesters.map((item, index) => (
                                    <MenuItem
                                        value={item}
                                        key={`semester-${index}`}
                                    >
                                        {item}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Item>
                </Grid>

                <Grid item xs={12}>
                    <Item className={classes.item}>
                        <Stack
                            spacing={2}
                            direction="row"
                            justifyContent="space-between"
                        >
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
