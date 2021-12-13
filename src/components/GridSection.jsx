import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Event, Edit, Schedule } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  box: {
    width: "100%",
    padding: "1rem 0",
    margin: "4rem auto",
    backgroundColor: "#eee",
    border: "0.2rem solid #ccc",
    borderRadius: "0.25rem",
  },
  item: {
    color: "white",
    boxShadow: "none",
    borderRadius: "0.25rem",
    background: "#eee",
    margin: "auto",
    opacity: "90%",
    width: "20%",
  },
  icon: {
    width: "auto",
    height: "auto",
    color: `${theme.palette.primary.main}`,
    padding: "auto 10rem",
  },
  dialog: {
    color: "#555",
    textAlign: "center",
  },
  text: {
    fontSize: "large",
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const information = [
  { icon: Event, headline: "Horário Inicial", text: "Consultar horário incial feito pelo departamento do curso", },
  { icon: Edit, headline: "Solicitar Troca", text: "Escolher a(s) turma(s) destino para as unidades curriculares com horários indesejados", },
  { icon: Schedule, headline: "Aguardar Resultados", text: "Consultar horário incial feito pelo departamento do curso", },
];

export default function GridSection() {
  const classes = useStyles();
  return (
    <Box className={classes.box} sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        {information.map((item, key) => (
          <Grid item key={key} xs={12} sm={4} md={4} xl={4}>
            <Item className={classes.item}>
              <item.icon className={classes.icon}/>
            </Item>
            <span className={classes.dialog}>
              <h2>{item.headline}</h2>
              <p className={classes.text}>{item.text}</p>
            </span>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

GridSection.propTypes = {};
