import { Button } from '../../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import CsvExport from './CsvExport'
import CsvImport from './CsvImport'
import NitSigExport from './NitSigExport'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import React, { useContext, useRef } from 'react'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { csvDecode } from '../../../../utils/io'
import { toast } from '../../../ui/use-toast'
import api from '../../../../api/backend'

/**
 * Sidebar with all the main schedule interactions
 */
const Export = () => {

  const fileInputRef = useRef(null);
  const { pickedCourses, setPickedCourses, setCheckboxedCourses } = useContext(CourseContext);
  const { multipleOptions, setMultipleOptions } = useContext(MultipleOptionsContext);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) {
      throw new Error('No file selected');
    }

    try {
      const content = csvDecode(await file.text());
      console.log("input content",content);
      const courses = await getSelectedCourses(content);
      console.log("selected courses",courses);

      setCheckboxedCourses(courses);
      setPickedCourses(courses);
      setCourseOptions(content, courses);
    } catch (error) {
      toast({
        title: 'Não foi possível importar os horários!',
        description: 'Ocorreu um erro ao ler ou interpretar o ficheiro importado: ' + error,
        position: 'top-right',
      });
    }
  };

  const getSelectedCourses = async (content: string[][]): Promise<CourseInfo[]> => {
    if (!Array.isArray(content) || content.length === 0) return [];

    const courses: CourseInfo[] = [];
  
    const promises = content.map(async (row) => {
      const res = await api.getCoursesByMajorId(parseInt(row[0]));
      const matchedCourses = res.filter(course => course.acronym === row[3]);
      courses.push(...matchedCourses);
    });
  
    await Promise.all(promises);

    for(const course of courses){
      if(typeof(course.ects) === "string")
        course.ects = parseFloat(course.ects.replace(",", "."));
    }

    return courses;
  };

  const setCourseOptions = async (content: string[][], courses: CourseInfo[]) => {
    const updatedOptions = [...multipleOptions];

    for (let i = 0; i < courses.length; i++) {
      const courseOptions = await api.getCourseClass(courses[i]);
      content[i].slice(4).forEach((courseOption, j) => {
        const matchedClassOption = courseOptions.find(classOption => classOption.name === courseOption);
        if (matchedClassOption) {
          updatedOptions[j].course_options.push(createCourseOption(courses[i].id, matchedClassOption.id));
        }
      });
    }

    setMultipleOptions(updatedOptions);
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
