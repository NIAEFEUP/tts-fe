import React from "react";
import PropTypes from 'prop-types';
import { makeStyles } from "@mui/styles";

import Button from '@mui/material/Button';

const useStyles = makeStyles((theme) => ({
    optionButton: {
        textTransform: "none",
        width: "100%",
        justifyContent: "flex-start",
        color: "#444444",
        paddingLeft: "1em",
    },
    selectedButton: {
        border: "1px solid " + theme.palette.primary.main,
        fontWeight: "bold",
        color: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.secondary.main,
        }
    },
    icon: {
        marginRight: "0.3em",
    },
}));

const OptionRow = ({ Icon, label, selectedButton, setSelectedButton }) => {

    const isSelected = selectedButton === label;

    const classes = useStyles();

    return (
        <div>
            <Button
                onClick={() => setSelectedButton(label)}
                variant={isSelected ? "contained" : "text"}
                size="large"
                color={isSelected ? "secondary" : "primary"}
                className={isSelected ? `${classes.optionButton} ${classes.selectedButton}` : classes.optionButton}
            >
                <Icon className={classes.icon} />
                {label}
            </Button>
        </div>
    );
};

OptionRow.propTypes = {
    Icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    selectedButton: PropTypes.string.isRequired,
    setSelectedButton: PropTypes.func.isRequired,
};


export default OptionRow;
