import React from 'react';
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Stack, Button } from '@mui/material';
import { Box } from '@mui/system';


class HeroPost extends React.Component {
    render() {
        return (
            <Box
                sx={{
                    pt: 9,
                    pb: 6,
                }}
            >
                <Container maxWidth="sm">
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
                        sx={{
                            fontWeight: 'light'
                        }}
                        paragraph
                    >
                        The best application to choose your schedule
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="center"
                        sx={{
                            pt: 3
                        }}
                    >
                        <Button
                            variant="outlined"
                            href="#"
                            color="inherit"
                        >
                            TTS website
                        </Button>
                        <Button
                            variant="outlined"
                            href="#"
                            color="inherit"
                        >
                            FEUP exchange website
                        </Button>
                    </Stack>
                </Container>
            </Box>
        )
    }
}

export default HeroPost;