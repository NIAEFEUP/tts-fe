import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = responsiveFontSizes(createTheme({
    palette: {
        primary: {
            main: "#46ae9a",
        },
        secondary: {
            main: "#e0f2f2",
        },
    }
}));

// Add custom palette variants
theme.palette = {
    ...theme.palette,
    tertiary: {
        main: "#C1D2D6",
    },
    dark: {
        main: "#444444",
    },
};

export default theme;
