import { CheckedCourse, Major } from '../@types'
import { majorsData, coursesData, schedulesData, extraCoursesData } from '../utils/data'
//import fetch from 'node-fetch'; 

let backend: string = "https://localhost:8000";

const getMajors = async () => {
  const response =  await fetch(`http://localhost:8000/course/`)
  .then((response)=> {
    return response.json()}
  )
  .catch((error)=>console.error(error)); 
  console.log(response)
  // TODO: replace majorsData with backend request
  return response
}     

const getCourses = (major: Major) => {
  // TODO: replace courseData with backend request
  return coursesData
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
