import { CourseOption, MultipleOptions, CheckedCourse, Major, CourseSchedule, ImportedCourses } from '../../../../@types'
import getMajors from '../../../../api/backend'
import { getCourseTeachers } from '../../../../utils/utils'
import { Button } from '../../../ui/button'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../../ui/use-toast'
import React, { useState } from 'react'
import ConfirmationModal from './ConfirmationModal'
import { Buffer } from 'buffer'

type Props = {
  majors: Major[]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
  className?: string
}

const PasteOption = ({ majors, majorHook, multipleOptionsHook, className }: Props) => {
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const [major, setMajor] = majorHook
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()

  // Temporary state to store the schedule tokens to be imported from clipboard between modal open and confirmation
  const [importingCoursesUnitOptions, setImportingCoursesUnitOptions] = useState<ImportedCourses>({})
  const [importingMajor, setImportingMajor] = useState<Major>(null)

  const importSchedule = async () => {
    const decoded_url = Buffer.from(await navigator.clipboard.readText(), 'base64').toString()

    if (!isValidURL(decoded_url)) {
      toast({
        title: 'Erro ao colar opção',
        description: 'O texto do clipboard não é uma opção válida',
        duration: 3000,
      })
      return
    }

    //ex: 36;1033#3LEIC02;1062#null;1044#null;1031#null;980#null;969#null
    var tokens: string[] = decoded_url.split(';')
    const major_id = Number(tokens.shift())

    var importedCourses: ImportedCourses = {}
    tokens.forEach((token) => {
      const course = token.split('#')
      importedCourses[course[0]] = course[1]
    })

    if (major_id !== major.id) {
      setImportingCoursesUnitOptions(importedCourses)
      const importingMajor = majors.find((major) => major.id === major_id)
      setImportingMajor(importingMajor)
      setModalOpen(true)
      return
    }


    var newOption = multipleOptions.options[multipleOptions.index]
    newOption = newOption.map((courseOption: CourseOption) => {
      const clearedOption = courseOption
      clearedOption.option = null
      return clearedOption
    })

    newOption.forEach((courseOption: CourseOption) => {
      const courseUnitId = courseOption.course.info.course_unit_id

      const importingScheduleClassName = importedCourses[courseUnitId]
      if (importingScheduleClassName === undefined) return

      //get the schedule with class_name === importedSchedule from courseOption.schedules
      const newSchedule = courseOption.schedules.find((schedule) => schedule.class_name === importingScheduleClassName)
      if (newSchedule === undefined) return //TODO: need to select the UC

      //replace the schedule
      courseOption.option = newSchedule
    })

    setMultipleOptions((prevMultipleOptions) => {
      const newOptions = [...prevMultipleOptions.options]
      newOptions[prevMultipleOptions.index] = newOption
      const value = {
        index: prevMultipleOptions.index,
        selected: newOption,
        options: newOptions,
        names: prevMultipleOptions.names,
      }

      return value
    })

    toast({
      title: 'Horário colado!',
      description: 'A opção foi colada com sucesso',
      duration: 1500,
    })
  }

  /**
   * 
   * @param options Decoded URL with major and courses units options
   * @returns true if the url is valid
   */
  const isValidURL = (url: string) => {
    const tokens = url.split(';')
    if (tokens.length < 2) return false //At leat a major and one course

    // Validate major
    const major_id = tokens.shift()
    if (isNaN(Number(major_id))) return false

    // Validate courses: course_unit_id#selected_option_id
    tokens.forEach((token) => {
      const course = token.split('#')
      if (course.length !== 2) return false
      if (isNaN(Number(course[0])) || isNaN(Number(course[1]))) return false
    })

    return true
  }

  const importScheduleWithDifferentMajor = async () => {
    //get importing major courses units information
    try {
      var course_units = await getMajors.getCourses(importingMajor)
    } catch (e: any) {
      console.log(e)
      return
    }

    let imported_course_units: CourseOption[] = [];
    for (const [course_unit_id, class_name_option] of Object.entries(importingCoursesUnitOptions)) {

      //get the course_unit info
      const course_unit_info = course_units.find((course_unit) => course_unit.course_unit_id === Number(course_unit_id))

      const checked_course : CheckedCourse = {
        checked: true,
        info: course_unit_info,
      }
      
      // get all the course unit schedules
      try {
        var course_schedules : CourseSchedule[] = await getMajors.getCourseSchedule(checked_course)
      } catch (e: any) {
        console.log(e)
      }

      // Find the selected schedule
      const selected_option = class_name_option !== 'null' ? course_schedules.find((schedule) => schedule.class_name === class_name_option && schedule.lesson_type !== 'T') : null;

      const course_option : CourseOption = {
        shown: {
          T: true,
          TP: true,
        },
        locked: false,
        course: checked_course,
        option: selected_option,
        schedules: course_schedules,
        teachers: [],
        filteredTeachers: [],
      }

      let course_teachers = getCourseTeachers(course_option)
      course_option.teachers = course_teachers
      course_option.filteredTeachers = course_teachers

      imported_course_units.push(course_option)
    };

    // Create the new option with the imported courses
    const importedOption = {
      name: 'Importado',
      courses: imported_course_units,
    }

    setMultipleOptions((prevMultipleOptions) => {
      const newOptions = [...prevMultipleOptions.options]
      newOptions[prevMultipleOptions.index] = importedOption.courses
      const value = {
        index: prevMultipleOptions.index,
        selected: importedOption.courses,
        options: newOptions,
        names: prevMultipleOptions.names,
      }

      return value
    })
    setMajor(importingMajor)
    setModalOpen(false)
  }

return (
  <>
    <Button variant="icon" className={className.concat(' h-min w-min flex-grow bg-primary')}>
      <ClipboardDocumentIcon onClick={importSchedule} className="h-5 w-5" />
    </Button>
    <ConfirmationModal
      major={importingMajor}
      isOpen={modalOpen}
      closeModal={() => {
        setModalOpen(false)
      }}
      confirmationAction={importScheduleWithDifferentMajor}
    />
  </>
)
}

export default PasteOption
