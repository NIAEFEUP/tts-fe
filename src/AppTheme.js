import { createTheme, responsiveFontSizes } from '@mui/material/styles';


const theme = responsiveFontSizes(createTheme({
    palette: {
        primary: {
            main: "#B33636",
            light: "#bf6060"
        },
        secondary: {
            main: "#FFFFFF",
        },
    },
    status: {
        danger: "orange",
    },
    typography: {
        fontFamily: [
            "Poppins",
            "Roboto",
            "sans-serif",
        ].join(","),
    },
}));

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
