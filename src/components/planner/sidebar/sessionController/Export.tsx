import { Button } from '../../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import CsvExport from './CsvExport'
import NitSigExport from './NitSigExport'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import CsvImport from './CsvImport'
import React, { useContext, useRef } from 'react'
import { csvDecode } from './IOUtils'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import api from '../../../../api/backend'
import { CourseInfo } from '../../../../@types'
import StorageAPI from '../../../../api/storage'
import { toast } from '../../../ui/use-toast'

/**
 * Sidebar with all the main schedule interactions
 */
const Export = () => {

  const fileInputRef = useRef(null);
  const { setPickedCourses, setCheckboxedCourses } = useContext(CourseContext);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) {
      throw new Error('No file selected');
    }

    try {
      const content = csvDecode(await file.text());
      const courses = await getSelectedCourses(content);

      StorageAPI.setPickedCoursesStorage(courses);
      setCheckboxedCourses(courses);
      setPickedCourses(courses);

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

    const results = await Promise.all(content.slice(1).map(row => api.getCourseUnit(row[0])));

    return results;
  };


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
