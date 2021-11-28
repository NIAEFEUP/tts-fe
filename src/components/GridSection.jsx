import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { CalendarIcon, PencilAltIcon, ClockIcon } from "@heroicons/react/outline";

const useStyles = makeStyles({
  box: {
    width: "100%",
    padding: "1rem",
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
    color: "#10948b",
    padding: "auto 10rem",
  },
  dialog: {
    color: "#555",
    textAlign: "center",
  },
  text: {
    fontSize: "large"
  }
});

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function GridSection() {
  const classes = useStyles();
  return (
    <Box className={classes.box} sx={{ flexGrow: 1 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4} md={4} xl={4}>
          <Item className={classes.item}>
            <CalendarIcon className={classes.icon} />
          </Item>
          <span className={classes.dialog}>
            <h2>Horário Inicial</h2>
            <p className={classes.text}>Consultar horário incial feito pelo departamento do curso</p>
          </span>
        </Grid>
        <Grid item xs={12} sm={4} md={4} xl={4}>
          <Item className={classes.item}>
            <PencilAltIcon className={classes.icon} />
          </Item>
          <span className={classes.dialog}>
            <h2>Solicitar troca</h2>
            <p className={classes.text}>Escolher a(s) turma(s) destino para as unidades curriculares com horários indesejados</p>
          </span>
        </Grid>
        <Grid item xs={12} sm={4} md={4} xl={4}>
          <Item className={classes.item}>
            <ClockIcon className={classes.icon} />
          </Item>
          <span className={classes.dialog}>
            <h2>Aguardar resultados</h2>
            <p className={classes.text}>Esperar pelo resultado do processamento otimizado</p>
          </span>
        </Grid>
      </Grid>
    </Box>
  );
}

GridSection.propTypes = {};
