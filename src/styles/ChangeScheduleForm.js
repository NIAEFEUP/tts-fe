import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    form: {
        marginRight: "1rem",
    },
    checkbox: {
        padding: "0.25rem",
        marginLeft: "0.25rem",
        color: theme.palette.secondary.main,
    },
    header: {
        fontWeight: "600",
        marginBottom: "0.5rem",
        letterSpacing: "0.005rem",
        textTransform: "uppercase",
        color: theme.palette.primary.main,
    },
    subheader: {
        fontWeight: "600",
        marginBottom: "0.5rem",
        letterSpacing: "0.00rem",
        textTransform: "uppercase",
        color: theme.palette.pratical.main,
    },
}));

export const sxs = {
    select: {
        marginTop: 0.5,
        marginBottom: 0.75,
        width: "auto",
        maxWidth: 360,
    },
    flexColumn: {
        flexDirection: "column",
    },
    spaceAbove: {
        marginTop: "1.5rem",
    },
    selectValue: {
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
    },
    input: {
        fontSize: "0.9rem",
        letterSpacing: 0,
    },
};
