import { CourseOption, Major, MultipleOptions } from '../../../../@types'
import { Button } from '../../../ui/button'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../../ui/use-toast'
import React, { Fragment, useState } from 'react'
import ConfirmationModal from './ConfirmationModal'


type Props = {
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>],
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const PasteOption = ({ majorHook, multipleOptionsHook }: Props) => {

  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const [major, setMajor] = majorHook
  const [modalOpen, setModalOpen] = useState(false)
  const { toast } = useToast()

  const importSchedule = async () => {
    const value = await navigator.clipboard.readText()

    if (!isValidOption(value)) {
      toast({
        title: 'Erro ao colar opção',
        description: 'O texto do clipboard não é uma opção válida',
        duration: 3000,
      })
      return
    }

    //ex: 36;1033#3LEIC02;1062#null;1044#null;1031#null;980#null;969#null
    var tokens: string[] = value.split(';')
    const major_id = Number(tokens.shift())

    if (major_id !== major.id) {
      setModalOpen(true)
      return
    }

    var importedCourses: { [key: string]: string } = {}
    tokens.forEach((token) => {
      const course = token.split('#')
      importedCourses[course[0]] = course[1]
    })

    var newOption = multipleOptions.options[multipleOptions.index]
    newOption = newOption.map((courseOption: CourseOption) => {
      const clearedOption = courseOption
      clearedOption.option = null
      return clearedOption
    })

    newOption.forEach((courseOption: CourseOption) => {
      const courseUnitId = courseOption.course.info.course_unit_id;

      const importingScheduleClassName = importedCourses[courseUnitId]
      if (importingScheduleClassName === undefined) return;

      //get the schedule with class_name === importedSchedule from courseOption.schedules
      const newSchedule = courseOption.schedules.find((schedule) => schedule.class_name === importingScheduleClassName)
      if (newSchedule === undefined) return; //TODO and DISCUSS: need to fetch the course here or select it

      //replace the schedule
      courseOption.option = newSchedule
    });

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
  }

  const isValidOption = (options: string) => {
    const tokens = options.split(';')
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


  return (
    <>
      <Button variant="icon" className="h-min w-min bg-primary xl:p-1">
        <ClipboardDocumentIcon onClick={importSchedule} className="w-5 h-5" />
      </Button>
      <ConfirmationModal isOpen={modalOpen} closeModal={() => {setModalOpen(false)}} confirmationAction={() => {console.log(123)}} />
    </>
  )
}

export default PasteOption
