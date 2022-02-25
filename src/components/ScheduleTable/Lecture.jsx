import React from 'react'; 

/**
 * Data function that stores the information of a certain lecture schedule. 
 * This function is useful, because if the structure of the data changes, it's
 * only necessary to modify this function. 
 * @param {Object} lectureInfo 
 */
const Lecture = (lectureInfo) => { 
    let lectureName = lectureInfo.lectureName; 
    let startHour = lectureInfo.startHour; 
    let finishHour = lectureInfo.finishHour; 
    let acronym = lectureInfo.acronym; 
    let classroom = lectureInfo.classroom; 
} 