import { BarLoader } from "react-spinners";
import useStudentEnrollments from "../../../hooks/admin/useStudentEnrollments";
import { StudentEnrollmentCard } from "./cards/StudentEnrollmentCard";

export const StudentEnrollments = () => {
    const { enrollments, loading } = useStudentEnrollments();

    return (
        <>
            {loading && <BarLoader className="w-full" />}

            {!loading && enrollments?.map((enrollment) => (
                <StudentEnrollmentCard enrollment={enrollment} />
            ))}
        </>
    )
}