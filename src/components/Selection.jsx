import * as React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { makeStyles } from "@mui/styles";
import { styled } from "@mui/material/styles";

const useStyles = makeStyles((theme) => ({
  box: {
    width: "100%",
    padding: "1rem 0",
    margin: "4rem auto",
    backgroundColor: "#fafafa",
    border: "0.2rem solid #ccc",
    borderRadius: "0.25rem",
  },
  item: {
    color: "white",
    boxShadow: "none",
    borderRadius: "0.25rem",
    background: "#fafafa",
    padding: "0 1rem",
    margin: "auto",
  },
  header: {
    textAlign: "center",
    color: `${theme.palette.primary.main}`,
    marginBottom: "1rem"
  }
}));

const semesters = [
  { label: 1 },
  { label: 2 },
]

const years = [
  { label: 1 },
  { label: 2 },
  { label: 3 },
]

const universities = [
  { label: 'Faculdade de Engenharia da Universidade do Porto' },
  { label: 'Faculdade de Ciêcnias da Universidade do Porto' },
  { label: 'Faculdade de Desporto da Universidade do Porto' },
  { label: 'Faculdade de Farmácia da Universidade do Porto' },
];

const courses = [
  { label: 'Licenciatura em Engenharia Informática e Computação' },
  { label: 'Licenciatura em Engenharia Eletrotécnica e de Computadores' },
  { label: 'Licenciatura em Engenharia Mecânica' },
  { label: 'Mestrado em Engenharia Informática e Computação' },
];

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Selection() {
  const classes = useStyles();
  return (
    <Box className={classes.box} sx={{ flexGrow: 1 }}>
      <h1 className={classes.header}>Escolhas</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} xl={12}>
          <Item className={classes.item}>
            <Autocomplete
              disablePortal
              id="university-selection"
              className={classes.autocomplete}
              options={universities}
              renderInput={(params) => <TextField {...params} label="Faculdade" />}
            />
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={12} xl={12}>
          <Item className={classes.item}>
            <Autocomplete
              disablePortal
              id="course-selection"
              options={courses}
              renderInput={(params) => <TextField {...params} label="Curso" />}
            />
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={6} xl={6}>
          <Item className={classes.item}>
            <Autocomplete
              disablePortal
              id="university-selection"
              options={years}
              renderInput={(params) => <TextField {...params} label="Ano Letivo" />}
            />
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={6} xl={6}>
          <Item className={classes.item}>
            <Autocomplete
              disablePortal
              id="semester-selection"
              options={semesters}
              renderInput={(params) => <TextField {...params} label="Semestre" />}
            />
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={12} xl={12}>
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
