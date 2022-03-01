import { makeStyles } from "@mui/styles";

export const selectionStyles = makeStyles((theme) => ({
    box: {
        width: "70vw",
        padding: "2rem 1rem",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: 24,
        margin: "auto",
        backgroundColor: "#fafafa",
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
    menuItem: {
        textAlign: "left",
    },
    flexCenterStart: {
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
    },
    headerBox: {
        margin: "0 1rem 1rem 1rem",
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
