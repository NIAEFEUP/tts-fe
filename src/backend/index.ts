import { CheckedCourse, Major } from '../@types'
import { majorsData, coursesData, schedulesData, extraCoursesData } from '../utils/data'
//import fetch from 'node-fetch'; 

let backendUrl: string = "http://localhost:8000";

const getResponse = async (url: string) => {
  console.log(url)
  const response = await fetch(`${url}`)
    .then((response) => {
      return response.json()
    })
    .catch((error) => console.error(error));
    console.log(response)
    return response; 
} 


const getMajors = async () => {
  return await getResponse(`${backendUrl}/course/`);
}


const getCourses = async (major: Major) => {
  if (major === null) return [];
  // TODO: store the env variable in a dotenv
  return await getResponse(`${backendUrl}/course_units/35/1/`)
  // return await getResponse(`${backendUrl}/course_units/${major.course_id}/1/`)
}

const getCourseSchedule = (course: CheckedCourse) => {
  // TODO: Replace schedulesData (static IART) with backend request
  return schedulesData[Math.floor(Math.random() * schedulesData.length)]
}

const getExtraCourses = (major: Major) => {
  // TODO: get courses data from all majors other than major
  return extraCoursesData
}

export { getMajors, getCourses, getCourseSchedule, getExtraCourses }
