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
import Backend from '../../../../api/backend'
import StorageAPI from '../../../../api/storage'
import { CourseInfo, CourseOption } from '../../../../@types'

const Export = () => {

  const fileInputRef = useRef(null);
  const { setPickedCourses, setCheckboxedCourses } = useContext(CourseContext);
  const { multipleOptions, setMultipleOptions } = useContext(MultipleOptionsContext);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) throw new Error('No file selected');

    try {
      // set loadingSchedule to true
      const content = csvDecode(await file.text());
      const courses = await getSelectedCourses(content);

      setCheckboxedCourses(courses);
      setPickedCourses(courses);
      setCourseOptions(content, courses);
      // set loadingSchedule to false
      // TODO: THE CLASSES ONLY GET SELECTED AFTER SELECTING ANY RANDOM BUTTON, FIX THIS
    } catch (error) {
      toast({
        title: 'Não foi possível importar os horários!',
        description: 'Ocorreu um erro ao ler ou interpretar o ficheiro importado: ' + error,
        position: 'top-right',
      });
    } finally {
      // set loadingSchedule to false
    }
  };

  const getSelectedCourses = async (content: string[][]): Promise<CourseInfo[]> => {
    if (!Array.isArray(content) || content.length === 0) return [];

    const courses: CourseInfo[] = [];
  
    const promises = content.map(async (row) => {
      const res = await Backend.getCoursesByMajorId(parseInt(row[0]));
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
    const scheduleOptions = content.map(row => row.slice(4));
    for (let i = 0; i < scheduleOptions[0].length; i++) {
      multipleOptions[i].course_options = [];
    }

    for (let i = 0; i < scheduleOptions.length; i++) {
      for(let j = 0; j < 10; j++){
        while(courses[i].classes === undefined) await new Promise(resolve => setTimeout(resolve, 100));
        
        const foundClassId = courses[i].classes.find(c => c.name === scheduleOptions[i][j]);
        const newCourseOption = createCourseOption(courses[i].id, foundClassId ? foundClassId.id : null);
        multipleOptions[j].course_options.push(newCourseOption);
      }
    }
    StorageAPI.setMultipleOptionsStorage(multipleOptions);
    setMultipleOptions(multipleOptions);
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
