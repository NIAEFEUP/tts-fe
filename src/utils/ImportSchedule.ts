import { Buffer } from "buffer"
import { CourseInfo, ImportedCourses, Major, MultipleOptions, PickedCourses } from "../@types"
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
  setPickedCourses: (newPickedCourses : PickedCourses) => void,
  setSelectedMajor: (newMajor: Major) => void,
  setCheckboxedCourses : (newCheckboxedCourses : CourseInfo[]) => void,
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

  //ex: major_id;course_id#picked_class_id;course_id#picked_class_id
  const tokens: string[] = decoded_url.split(';')

  const majorID = tokens.shift();
  const majors: Major[] = await api.getMajors();
  
  
  //TODO (thePeras): A more function programming oportunity here
  const importedCourses: ImportedCourses = {}
  tokens.forEach((token) => {
    const course = token.split('#')
    importedCourses[course[0]] = course[1]
  })

  const uncheckedCoursesIds = Object.keys(importedCourses)

  if (uncheckedCoursesIds.length > 0) {
    // TODO: getCourseUnit route doesn't return enough information (i.e. ECTS)
    const unfilteredCourses : CourseInfo[] = await api.getCoursesByMajorId(Number(majorID))
    const courses : CourseInfo[] = unfilteredCourses.filter((course) => 
      uncheckedCoursesIds.includes(course.course_unit_id.toString())
    )

    setPickedCourses(courses)
    setCheckboxedCourses(courses)

    const newMultipleOptions = [...multipleOptions]

    const optionIndex = newMultipleOptions.findIndex(o => o.id == selectedOption);

    if(optionIndex !== -1){
      const newCourso = courses.map((course) => convertCourseInfoToCourseOption(course));

      newMultipleOptions[optionIndex].course_options = newCourso;

      fillOptions(importedCourses, newMultipleOptions, setMultipleOptions, selectedOption)
    }
  }


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
  if (tokens.length < 1) return false; // At least major
  if (tokens.length < 2) return false; // At least on class

  // Validate majorID
  const majorID= tokens.shift();
  if(isNaN(Number(majorID))) return false;

  // Validate courses: course_unit_id#selected_option_id
  tokens.forEach((token) => {
    const course = token.split('#')
    if (course.length !== 2) return false
    if (isNaN(Number(course[0])) || isNaN(Number(course[1]))) return false
  })

  return true;
}
