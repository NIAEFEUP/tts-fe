import { CourseUnitEnrollmentType, EnrollmentOption } from "../../components/exchange/enrollments/Enrollments";
import api from "../backend";

const submitEnrollmentRequest = async (courses: Map<number, EnrollmentOption>) => {
  const formData = new FormData();

  for (const [key, value] of courses) {
    formData.append(`enrollCourses[]`, JSON.stringify({ 
      course_unit_id: key, 
      class_id: value.classId, 
      enrolling: value.type === CourseUnitEnrollmentType.ENROLLING 
    }));
}

  return fetch(`${api.BACKEND_URL}/course_unit/enrollment/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": api.getCSRFToken(),
    },
    body: formData
  });
}

const courseUnitEnrollmentService = {
  submitEnrollmentRequest
}

export default courseUnitEnrollmentService;
