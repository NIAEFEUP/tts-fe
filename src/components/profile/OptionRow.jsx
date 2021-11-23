import React from "react";

import Button from '@mui/material/Button';

const OptionRow = ({ Icon, label, selectedButton, setSelectedButton }) => {

    return (
        <Button
            onClick={() => setSelectedButton(label)}
            variant={selectedButton === label ? "contained" : "text"}
        >
            <div>
                <Icon />
                {label}
            </div>
        </Button>
    );
};

export default OptionRow;
