import { Button } from '../../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import CsvImport from './CsvImport'
import React, { useContext, useRef } from 'react'
import { csvDecode } from '../../../../utils/io'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import api from '../../../../api/backend'
import { CourseInfo } from '../../../../@types'
import { toast } from '../../../ui/use-toast'

/**
 * Sidebar with all the main schedule interactions
 */
const Export = () => {

  const fileInputRef = useRef(null);
  const { setPickedCourses, setCheckboxedCourses } = useContext(CourseContext);
  const { multipleOptions, setMultipleOptions } = useContext(MultipleOptionsContext);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) {
      throw new Error('No file selected');
    }

    try {
      const content = csvDecode(await file.text());
      const courses = await getSelectedCourses(content);

      setCheckboxedCourses(courses);
      setPickedCourses(courses);
      setCourseOptions(content);
    } catch (error) {
      toast({
        title: 'Não foi possível importar os horários!',
        description: 'Ocorreu um erro ao ler ou interpretar o ficheiro importado: ' + error,
        position: 'top-right',
      });
    }
  };

  const getSelectedCourses = async (content: any): Promise<CourseInfo[]> => {
    if (!Array.isArray(content) || content.length === 0) return [];
  
    try {
      // Fetch all courses in parallel
      const selected_courses = await Promise.all(content.map(row => api.getCourseUnit(row[0])));
  
      // Fetch all majors in parallel
      const majorsPromises = selected_courses.map(course => api.getCoursesByMajorId(course.course));
      const majorsResults = await Promise.all(majorsPromises);
  
      // Map the ECTS values to the corresponding courses
      selected_courses.forEach((course, index) => {
        const full_courses = majorsResults[index];
        const matching_course = full_courses.find(indiv_course => indiv_course.course_unit_id === course.id);
        if (matching_course) {
          course.ects = matching_course.ects;
        }
      });
  
      return selected_courses;
    } catch (error) {
      throw error;
    }
  };

  const setCourseOptions = (courses: number[][]) => {
    const transposedCourses = courses[0].map((_, colIndex) => courses.map(row => row[colIndex]));
  
    const newOptions = transposedCourses.slice(1, 11).map((column, i) => 
      createOption(multipleOptions[i], column.map((value, j) => 
        createCourseOption(transposedCourses[0][j], value)
      ))
    );
  
    setMultipleOptions(newOptions);
  };

  const createCourseOption = (course_id: number, picked_class_id: number): CourseOption => {
    return {
      course_id: course_id,
      picked_class_id: Number.isNaN(picked_class_id) ? null : picked_class_id,
      locked: false,
      filteredTeachers: null,
      hide: []
    }
  }

  const createOption = (option : Option, new_course_options : Array<CourseOption>) => {
    return {
      id: option.id,
      icon: option.icon,
      name: option.name,
      course_options: new_course_options
    }
  }

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const inputComponent = (
    <input
      type="file"
      accept=".csv"
      ref={fileInputRef}
      className="hidden"
      onChange={async (e) => {
        await handleFileChange(e)
      }}
    />
  )

  const menuItems = [
    {component: <CsvExport/>},
    {component: <CsvImport handleClick={handleClick}/>},
    {component: <NitSigExport/>}
  ]


  return (
    <>
      {inputComponent}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="icon" className="bg-primary">
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {menuItems.map((item, index) => (
            <DropdownMenuItem key={index}>
              {item.component}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default Export
