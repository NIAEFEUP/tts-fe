import { BarLoader } from "react-spinners";
import useStudentEnrollments from "../../../hooks/admin/useStudentEnrollments";
import { StudentEnrollmentCard } from "./cards/StudentEnrollmentCard";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import { useContext } from "react";

export const StudentEnrollments = () => {
    const filterContext = useContext(RequestFiltersContext);
    const { enrollments, loading } = useStudentEnrollments(filterContext);

    return (
        <>
            {loading && <BarLoader className="w-full" />}

            {!loading && enrollments?.map((enrollment) => (
                <StudentEnrollmentCard 
                    key={`student-enrollment-${enrollment.id}`}
                    enrollment={enrollment} 
                />
            ))}
        </>
    )
}