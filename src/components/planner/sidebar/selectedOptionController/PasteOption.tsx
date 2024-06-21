import {
  MultipleOptions,
  CheckedCourse,
  Major,
  CourseSchedule,
  ImportedCourses,
} from '../../../../@types'
import { convertCourseInfoToCourseOption, getCourseTeachers } from '../../../../utils'
import { Button } from '../../../ui/button'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../../ui/use-toast'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import React, { useContext, useEffect, useState } from 'react'
import ConfirmationModal from './ConfirmationModal'
import { Buffer } from 'buffer'
import fillOptions from './fillOptions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { CourseInfo, CourseOption } from '../../../../@types/new_index'
import api from '../../../../api/backend'
import CourseContext from '../../../../contexts/CourseContext'

type Props = {
  isImportedOptionHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const PasteOption = ({ isImportedOptionHook }: Props) => {
  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext);
  const [otherCoursesImported, setOtherCoursesImported] = useState<boolean>(false);
  const { pickedCourses, setPickedCourses } = useContext(CourseContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [_, setIsImportedOption] = isImportedOptionHook
  const { toast } = useToast()

  // Temporary state to store the schedule tokens to be imported from clipboard between modal open and confirmation
  const [importingCoursesUnitOptions, setImportingCoursesUnitOptions] = useState<ImportedCourses>(null)
  const [importingMajor, setImportingMajor] = useState<Major>(null)

  const [isClipboardSupported, setIsClipboardSupported] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // Check if the browser Supports Clipboard API readText
  // Eventually this will become dead code when Firefox starts supporting Clipboard API readText method
  // See more: https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/readText
  useEffect(() => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      setIsClipboardSupported(true)
    }
  }, [])

  const importSchedule = async (value) => {
    const url = value
    const decoded_url = Buffer.from(url, 'base64').toString()
    const isImporteFromClipboard: boolean = value;

    if (!isValidURL(decoded_url)) {
      const description = isImporteFromClipboard
        ? 'O texto do clipboard não é uma opção válida'
        : 'O texto inserido não é uma opção válida'
      toast({
        title: 'Erro ao colar opção',
        description,
        duration: 3000,
      })
      return
    }

    setIsDropdownOpen(false)

    //ex: course_id#picked_class_id;course_id#picked_class_id
    const tokens: string[] = decoded_url.split(';')

    //TODO (thePeras): A more function programming oportunity here
    const importedCourses: ImportedCourses = {}
    tokens.forEach((token) => {
      const course = token.split('#')
      importedCourses[course[0]] = course[1]
    })

    // Unchecked imported courses units

    const checkedCoursesIds = multipleOptions[selectedOption].course_options.map((courseOption: CourseOption) => {
      return courseOption.course_id
    })

    const uncheckedCoursesIds = Object.keys(importedCourses).filter((course_unit_id) => {
      return !checkedCoursesIds.includes(Number(course_unit_id))
    })

    console.log("Unchecked course ids: ", uncheckedCoursesIds)

    if (uncheckedCoursesIds.length > 0) {
      setOtherCoursesImported(true);

      const courses: CourseInfo[] = (await Promise.all(uncheckedCoursesIds.map(async (course_unit_id) => {
        return await api.getCourseUnit(Number(course_unit_id))
      }))).flat();

      //append option to multipleOptions
      // const newMultipleOptions = [...multipleOptions];
      // newMultipleOptions[selectedOption].course_options = newMultipleOptions[selectedOption].course_options.concat(courses)
      // // newMultipleOptions[selectedOption].course_options.concat(courses);
      // // currentCourseOptions = currentCourseOptions.concat(courses)
      // setMultipleOptions(newMultipleOptions);

      const newPickedCourses = [...pickedCourses];
      setPickedCourses(newPickedCourses.concat(courses));

      let newMultipleOptions = [...multipleOptions];
      newMultipleOptions.forEach((option) => {
        option.course_options = option.course_options.concat(
          courses.map((course) => convertCourseInfoToCourseOption(course))
        )
        console.log("skill issue 2: ", option.course_options);
      });


      // newMultipleOptions[selectedOption].course_options = newMultipleOptions[selectedOption].course_options.concat(
      //   courses.map((course) => convertCourseInfoToCourseOption(course))
      // );
      setMultipleOptions(newMultipleOptions);

      /*
      //check the unCheckedCourses and fill the options
      setImportingCoursesUnitOptions(importedCourses)
      const unCheckedCoursesIds = unCheckedCourses.map((course_unit_id) => Number(course_unit_id))
      setIsImportedOption(true)
      // TODO (diogotvf7): this function and probably component will need a fix due to the refactor
      // as the whole data structure has changed
      // checkCourses(unCheckedCoursesIds, importedCourses)
      return*/
    }

    //setIsImportedOption(true)
    fillOptions(importedCourses, selectedOption, multipleOptions, setMultipleOptions);
    toast({
      title: 'Horário colado!',
      description: 'A opção foi colada com sucesso',
      duration: 1500,
    })
  }

  /**
   *
   * @param options Decoded URL with courses units options
   * @returns true if the url is valid
   */
  const isValidURL = (url: string) => {
    const tokens = url.split(';')
    if (tokens.length < 1) return false //At leat one course

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
      {isClipboardSupported ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="icon"
                onClick={async () => {
                  const value = await navigator.clipboard.readText()
                  importSchedule(value)
                }}
                className="h-min w-min flex-grow bg-primary sm:py-0 xl:p-1"
              >
                <ClipboardDocumentIcon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Colar horário</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <DropdownMenu open={isDropdownOpen}>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    onClick={() => setIsDropdownOpen(true)}
                    variant="icon"
                    className="h-min w-min flex-grow bg-primary sm:py-0 xl:p-1"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Colar horário</TooltipContent>
              <DropdownMenuContent>
                <input
                  autoFocus
                  type="text"
                  placeholder="Colar aqui opção"
                  className="text-slate-950 w-full rounded border border-slate-200 p-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-800 dark:text-slate-50"
                  onPaste={(e) => importSchedule(e.clipboardData.getData('text/plain'))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      importSchedule(e.currentTarget.value)
                    }
                  }}
                  onBlur={() => setIsDropdownOpen(false)}
                />
              </DropdownMenuContent>
            </Tooltip>
          </TooltipProvider>
        </DropdownMenu>
      )}
    </>
  )
}

export default PasteOption
