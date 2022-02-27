import { makeStyles } from "@mui/styles";

export const selectionStyles = makeStyles((theme) => ({
    box: {
        width: "70vw",
        padding: "1rem 0",
        margin: "auto",
        backgroundColor: "#fafafa",
        border: "0.2rem solid #ccc",
        borderRadius: "0.25rem",
        position: "relative",
    },
    item: {
        color: "white",
        boxShadow: "none",
        borderRadius: "0.25rem",
        background: "#fafafa",
        padding: "0 1rem",
        margin: "auto",
    },
    menuItem: {
        textAlign: "left",
    },
    flexCenterStart: {
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
    },
    headerBox: {
        margin: "0 1rem 0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    header: {
        textAlign: "left",
        color: "#555",
        marginLeft: "0.5rem",
    },
    spacing: {
        marginBottom: "2rem",
    },
}));
