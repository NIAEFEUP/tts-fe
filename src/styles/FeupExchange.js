import { makeStyles } from "@mui/styles";
import { cardHeight } from "./TimeTable";

export const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: "auto",
    },
    zone: {
        display: "flex",
        borderRadius: 1,
        padding: "1rem",
    },
    space: {
        marginRight: "1rem",
    },
    grow: {
        flexGrow: 1,
    },
    height: {
        minHeight: "100%",
    }, 

}));

export const sxs = {
    wrapper: {
        display: "flex",
        borderRadius: 1,
        padding: "1rem",
    },
    spacing: {
        marginRight: "1rem",
    },
    form: {
        marginRight: "1rem",
        minHeight: "100%",
        backgroundColor: "#fafafa",
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "2px solid #ddd",
    },
    preview: {
        flexGrow: 1, 
        minHeight: `${cardHeight*36}px`,
        backgroundColor: "#fafafa",
        padding: "1rem",
        borderRadius: "0.5rem",
        border: "2px solid #ddd",
    },
};
