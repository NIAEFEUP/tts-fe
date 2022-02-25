import React from "react";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/system";

export default function Hero() {
    return (
        <Box sx={{ pt: 12, pb: 10 }}>
            <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom={true}
            >
                Time Table Selector
            </Typography>
            <Typography
                variant="h5"
                color="text.secondary"
                align="center"
                sx={{ fontWeight: "light" }}
                paragraph
            >
                The best application to choose your schedule
            </Typography>
        </Box>
    );
}
