import { makeStyles } from "@mui/styles";

export const selectionStyles = makeStyles((theme) => ({
    box: {
        width: "70vw",
        padding: "1rem 0",
        margin: "auto",
        backgroundColor: "#fcfcfc",
        border: "0.2rem solid #ccc",
        borderRadius: "0.25rem",
    },
    item: {
        color: "white",
        boxShadow: "none",
        borderRadius: "0.25rem",
        background: "#fcfcfc",
        padding: "0 1rem",
        margin: "auto",
    },
    menuItem: {
        textAlign: "left",
    },
    header: {
        textAlign: "center",
        color: `${theme.palette.primary.main}`,
        marginBottom: "1rem",
        fontWeight: "bold",
    },
    spacing: {
        marginBottom: "2rem",
    },
}));
