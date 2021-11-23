import React, {useState} from "react";
import PropTypes from 'prop-types';
import { Home, Assessment, Today, Tune } from '@mui/icons-material';
import Button from '@mui/material/Button';

import Student from "./Student";
import OptionRow from "./OptionRow";
import Logo from "./Logo";

const ProfileCard = ({ student }) => {

    const [selectedButton, setSelectedButton] = useState("Home");

    const options = [
        {Icon: Home, label: "Home"},
        {Icon: Assessment, label: "My Schedule"},
        {Icon: Today, label: "Time Table Scheduler"},
        {Icon: Tune, label: "Preferences"},
    ];

    return (
        <>
            <Logo />

            <div>{student?.name}</div>
            <div>{student?.email}</div>

            <Button>Sign Out</Button>

            {options.map(({Icon, label}, key) => (
                <OptionRow
                    key={key}
                    Icon={Icon}
                    label={label}
                    selectedButton={selectedButton}
                    setSelectedButton={setSelectedButton}
                />
            ))}

        </>
    );
};

ProfileCard.propTypes = {
    student: PropTypes.instanceOf(Student),
};

export default ProfileCard;
