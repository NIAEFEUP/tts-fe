import { makeStyles } from "@mui/styles";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const useStyles = makeStyles((theme) => ({
    form: {
        marginRight: "1rem",
    },
    checkbox: {
        padding: "0.25rem",
        marginLeft: "0.25rem",
        color: theme.palette.primary.main,
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
    checked: {
        color: theme.palette.dark.main,
        marginLeft: "0.5rem",
    },
    unchecked: {
        color: theme.palette.dark.light,
    },
}));

export const sxs = {
    select: {
        marginTop: 0.5,
        marginBottom: 0.75,
        width: "auto",
        maxWidth: 360,
        backgroundColor: "#fff",
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
    badge: {
        color: "#fff",
        marginRight: "0",
        padding: "-1px",
    },
};
