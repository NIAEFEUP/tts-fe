import { Buffer } from "buffer"
import { CourseInfo, CourseOption, ImportedCourses, MultipleOptions, PickedCourses } from "../@types"
import { toast } from "../components/ui/use-toast"
import { AnalyticsTracker, Feature } from "./AnalyticsTracker"
import fillOptions from "../components/planner/sidebar/selectedOptionController/fillOptions"
import { convertCourseInfoToCourseOption } from "."
import api from "../api/backend"

export const importSchedule = async (
  value: string,
  multipleOptions: MultipleOptions,
  setMultipleOptions: (newMultipleOptions : MultipleOptions) => void,
  selectedOption: number,
  pickedCourses: PickedCourses ,
  setPickedCourses: (newPickedCourses : PickedCourses) => void,
) => {
  const url = value
  const decoded_url = Buffer.from(url, 'base64').toString()
  const isImporteFromClipboard: boolean = value === ''

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

    const newMultipleOptions = [...multipleOptions]
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

  AnalyticsTracker.trackFeature(Feature.PASTE)
}

/**
 *
 * @param options Decoded URL with courses units options
 * @returns true if the url is valid
 */
export const isValidURL = (url: string) => {
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
