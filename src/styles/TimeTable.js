import { makeStyles } from "@mui/styles";

export const timeTableStyles = makeStyles((theme) => ({
    container: {
        margin: "auto 0",
        padding: "4rem",
    },
    card: {
        minHeight: "100%",
        padding: "1rem",
    },
}));

export const sxs = {
    grid: {
        borderRadius: 1,
        padding: "1rem",
    },
    schedule: {
        flexGrow: 1,
        minHeight: "100%",
        backgroundColor: "#fafafa",
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "2px solid #ddd",
    },
    edit: {
        marginRight: "1rem",
        minHeight: "100%",
        backgroundColor: "#fafafa",
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "2px solid #ddd",
    },
};
