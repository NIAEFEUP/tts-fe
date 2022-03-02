import { makeStyles } from "@mui/styles";

export const timeTableStyles = makeStyles((theme) => ({
    container: {
        margin: "0 auto auto auto",
        width: "100%",
    },
    blur: {
        filter: "blur(5px)",
    },
    card: {
        padding: "1rem",
        minHeight: "6rem",
    },
    box: {
        width: "70vw",
        padding: "1.5rem 0.5rem",
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
    flexCenterBetween: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
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
    picker: {
        marginTop: "0.5rem",
    },
    pickersBox: {
        marginTop: "0.5rem",
    },
    tableLineContainer: {
        display: "flex",
        flexDirection: "row",
        padding: 0,
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
    },
    tableCard: (props) => ({
        borderRadius: 7,
        height: `${cardHeight * props.rowSpan}px`,
        width: `${cardWidth}px`,
        position: "absolute",
        top: `${cardHeight * props.top}px`,
        left: `${cardWidth * props.left}px`,
        background: `${getCardColor(props.classType, theme)}`,
    }),
    borderHalfHour: (props) => ({
        borderStyle: "solid",
        borderWidth: "1px",
        borderTop: `${props.borderTop}`,
        borderColor: "lightgrey",
        position: "absolute",
        height: `${cardHeight}px`,
        width: `${cardWidth}px`,
        top: `${cardHeight * props.top}px`,
        left: `${cardWidth * props.left}px`,
    }),
    hour: (props) => ({
        positions: "absolute",
        fontWeight: "bold",
        height: `${cardHeight}px`,
        width: `${cardWidth}px`,
        top: `${cardHeight * props.top}px`,
        left: `${cardHeight * 2}px`,
        fontSize: "smaller",
        textAlign: "center",
    }),
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

export const cardHeight = 23;
const cardWidth = 130;
const getCardColor = (classType, theme) => {
    if (classType === "T") return theme.palette.theoretical.main;
    else if (classType === "P") return theme.palette.pratical.main;
    else if (classType === "L") return theme.palette.labs.main;
};
