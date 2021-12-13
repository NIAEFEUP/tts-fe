import React from "react";
import ProfileCard from "../components/Profile/ProfileCard";
import Student from "../components/Profile/Student";

const ProfilePage = () => {
    let student = new Student({
        id: "id",
        name: "Afonso Medeiros",
        email: "up20xxxxxxx@edu.fe.up.pt",
        profilePicture: "some-path.png",
    });
    
    return (
        <ProfileCard student={student} />
    );
};

export default ProfilePage;
