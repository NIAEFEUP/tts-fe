import { CardMedia, Typography, Container } from '@mui/material';
import React from 'react';
import { Box } from '@mui/system';
import PropTypes from 'prop-types';

class CardFeature extends React.Component {
    render() {
        return (
            <Box sx={{
                my: 9,
                display: "flex",
                justifyContent: "space-around",
                flexDirection: this.props.direction,
            }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h4"
                        color="initial"
                        sx={{
                            fontWeight:"normal"
                        }}
                    >
                        {this.props.title}
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{
                            fontWeight: "light",
                            mb: 2,
                        }}
                    >
                        {this.props.subtitle}
                    </Typography> 

                    <Typography 
                    variant="tbody" 
                    color="initial">
                        {this.props.text}
                    </Typography>

                </Container>
                <CardMedia
                    sx={{ width: 600 }}
                    component="img"
                    image={this.props.image}
                />
            </Box>
        )
    }
}

CardFeature.propTypes = {
    title: PropTypes.string.isRequired, 
    subtitle: PropTypes.string.isRequired, 
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    diretion: PropTypes.string.isRequired,
}

export default CardFeature;