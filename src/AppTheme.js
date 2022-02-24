import { createTheme, responsiveFontSizes } from "@mui/material/styles";

const theme = responsiveFontSizes(
    createTheme({
        palette: {
            primary: {
                main: "#B33636",
                light: "#BF6060",
            },
            secondary: {
                main: "#893632",
                light: "#9E5956",
                bright: "#ECC2C1",
            },
            courses: {
                t: "#A8A199",
                tp: "#69656A",
                al: "#4F2E2E",
            },
            feup: "#7D221E",
        },
        status: {
            danger: "orange",
        },
        typography: {
            fontFamily: ["Poppins", "Roboto", "sans-serif"].join(","),
        },
    })
);

// Add custom palette variants
theme.palette = {
    ...theme.palette,
    tertiary: {
        main: "#C1D2D6",
    },
    dark: {
        main: "#2C2C2C",
    },
};

export default theme;
