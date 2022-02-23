import React from "react";
import Selection from "../components/Selection";
import Student from "../components/Profile/Student";
import ProfileCard from "../components/Profile/ProfileCard";

const TimeTablePage = () => {
    let student = new Student({
        id: "id",
        name: "Afonso Medeiros",
        email: "up20xxxxxxx@edu.fe.up.pt",
        profilePicture: "some-path.png",
    });

    return (
        <div>
            <ProfileCard student={student} />
            <Selection />
        </div>
    );
};

export default TimeTablePage;
