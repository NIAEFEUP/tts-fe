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
                dark: "#ECC2C1",
                light: "#9E5956",
            },
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
        dark: "#444444",
        light: "#333333",
    },
    feup: {
        main: "#7D221E",
    },
    pratical: {
        main: "#69656A",
        light: "#868387",
    },
    theoretical: {
        main: "#A8A199",
        light: "#B9B3AD",
    },
    labs: {
        main: "#4F2E2E",
        light: "#725757",
    },
};

export default theme;
