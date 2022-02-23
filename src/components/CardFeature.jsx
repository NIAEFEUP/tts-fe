import React from "react";
import PropTypes from "prop-types";
import { CardMedia, Typography, Container } from "@mui/material";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    leadText: {
        fontWeight: "light",
        mb: 2,
    },
    featureImage: {
        width: 600,
    },
    layout: {
        marginTop: "4rem",
        display: "flex",
        justifyContent: "space-around",
        flexDirection: (props) => props.direction,
    },
}));

const CardFeature = ({ title, subtitle, text, image, direction }) => {
    const styleProps = { direction: direction };
    const classes = useStyles(styleProps);
    return (
        <Box className={classes.layout}>
            <Container maxWidth="lg">
                <Typography variant="h4">{title}</Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    className={classes.leadText}
                >
                    {subtitle}
                </Typography>
                <Typography variant="tbody">{text}</Typography>
            </Container>
            <CardMedia
                className={classes.featureImage}
                component="img"
                image={image}
            />
        </Box>
    );
};

CardFeature.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
};

export default CardFeature;
