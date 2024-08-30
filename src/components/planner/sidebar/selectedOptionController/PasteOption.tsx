import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import { useContext, useEffect, useState } from 'react'
import { Buffer } from 'buffer'
import fillOptions from './fillOptions'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '../../../ui/dropdown-menu'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../../ui/tooltip'
import { ImportedCourses, CourseOption, CourseInfo } from '../../../../@types'
import api from '../../../../api/backend'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { convertCourseInfoToCourseOption } from '../../../../utils'
import { Button } from '../../../ui/button'
import { useToast } from '../../../ui/use-toast'

const PasteOption = () => {
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const { pickedCourses, setPickedCourses } = useContext(CourseContext)
  const { toast } = useToast()

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
    const isImporteFromClipboard: boolean = value

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

    if (uncheckedCoursesIds.length > 0) {
      const courses: CourseInfo[] = (
        await Promise.all(
          uncheckedCoursesIds.map(async (course_unit_id) => {
            return await api.getCourseUnit(Number(course_unit_id))
          })
        )
      ).flat()

      const newPickedCourses = [...pickedCourses]
      setPickedCourses(newPickedCourses.concat(courses))

      let newMultipleOptions = [...multipleOptions]
      newMultipleOptions.forEach((option) => {
        option.course_options = option.course_options.concat(
          courses.map((course) => convertCourseInfoToCourseOption(course))
        )
      })

      setMultipleOptions(newMultipleOptions)
    }

    fillOptions(importedCourses, multipleOptions, setMultipleOptions, selectedOption)

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
    if (url.length === 0) return false
    const tokens = url.split(';')
    if (tokens.length < 1) return false //At leat one course

    // Validate courses: course_unit_id#selected_option_id
    tokens.forEach((token) => {
      const course = token.split('#')
      if (course.length !== 2) return false
      if (isNaN(Number(course[0])) || isNaN(Number(course[1]))) return false
    })

    return true;
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
                  className="w-full rounded border border-slate-200 p-2 text-slate-950 focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-800 dark:text-slate-50"
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
