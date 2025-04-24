import { BarLoader } from "react-spinners";
import useStudentEnrollments from "../../../hooks/admin/useStudentEnrollments";
import { StudentEnrollmentCard } from "./cards/StudentEnrollmentCard";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import { useContext, useEffect } from "react";
import AdminPaginationContext from "../../../contexts/admin/AdminPaginationContext";

export const StudentEnrollments = () => {
    const filterContext = useContext(RequestFiltersContext);

    const { currPage, setTotalPages } = useContext(AdminPaginationContext);
    const { enrollments, loading, totalPages } = useStudentEnrollments(filterContext, currPage);

    useEffect(() => {
        setTotalPages(totalPages)
    }, [enrollments]);

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