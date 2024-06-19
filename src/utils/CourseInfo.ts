import { CourseInfo, ProfessorInfo } from "../@types/new_index";

export const teachersFromCourseInfo = (courseInfo: CourseInfo): ProfessorInfo[] => {
  const classes = courseInfo.classes;
  if (!classes) return [];

  return courseInfo.classes.flatMap((c) => c.slots.flatMap((s) => s.professors));
}

export const uniqueTeachersFromCourseInfo = (courseInfo: CourseInfo): ProfessorInfo[] => {
  const uniqueIds = new Set();
  console.log("techers from course info3: ", teachersFromCourseInfo(courseInfo));
  return teachersFromCourseInfo(courseInfo).filter(item => {
    if (!uniqueIds.has(item.id)) {
      uniqueIds.add(item.id);
      return true;
    }
    return false;
  });
}

export const teacherIdsFromCourseInfo = (courseInfo: CourseInfo): number[] => {
  const teacherIds = [];
  const uniqueTeachers = uniqueTeachersFromCourseInfo(courseInfo);

  uniqueTeachers.forEach((teacher: ProfessorInfo) => {
    teacherIds.push(teacher.id);
  });

  return teacherIds;
}
