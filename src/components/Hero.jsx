import React from 'react';
import Typography from '@mui/material/Typography'
import { Stack, Button } from '@mui/material';
import { Box } from '@mui/system';


class HeroPost extends React.Component {
    render() {
        return (
            <Box
                sx={{ pt: 12, pb: 10, }}
            >
                <Typography
                    component="h1"
                    variant="h2"
                    align="center"
                    color="text.primary"
                    gutterBottom="true"
                >
                    Time Table Selector
                </Typography>
                <Typography
                    variant="h5"
                    color="text.secondary"
                    align="center"
                    sx={{ fontWeight: 'light' }}
                    paragraph
                >
                    The best application to choose your schedule
                </Typography>

            </Box>
        )
    }
}

export default HeroPost;