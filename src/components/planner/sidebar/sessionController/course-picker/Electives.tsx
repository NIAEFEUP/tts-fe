import { useContext, useState } from 'react'
import { CourseInfo } from '../../../../../@types'
import CoursePickerContext from '../../../../../contexts/coursePicker/CoursePickerContext'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import { Label } from '../../../../ui/label'
import { ScrollArea } from '../../../../ui/scroll-area'
import { Checkbox } from '../../../../ui/checkbox'
import { addCourseOption, removeCourseOption } from '../../../../../utils'
import { ChevronRightIcon } from '@heroicons/react/24/solid'

const Electives = () => {
  const { checkboxedCourses, setCheckboxedCourses, electiveCourses } = useContext(CoursePickerContext)
  const { setMultipleOptions, multipleOptions } = useContext(MultipleOptionsContext)
  const [showElectives, setShowElectives] = useState(false)

  const electives = electiveCourses;

  if (electives.length === 0) {
    return null
  }

  const handleCheckedChange = (course: CourseInfo, checked: boolean) => {
    let newCheckboxedCourses = [...checkboxedCourses]
    let newMultipleOptions = [...multipleOptions]

    if (checked) {
      // remove other electives from selection (single selection logic)
      electives.forEach(elective => {
        if (newCheckboxedCourses.some(c => c.id === elective.id)) {
            newCheckboxedCourses = newCheckboxedCourses.filter(c => c.id !== elective.id)
            newMultipleOptions = removeCourseOption(elective, newMultipleOptions)
        }
      })
      
      // add the new one
      newCheckboxedCourses.push(course)
      newMultipleOptions = addCourseOption(course, newMultipleOptions)

    } else {
      // remove the course
       newCheckboxedCourses = newCheckboxedCourses.filter(c => c.id !== course.id)
       newMultipleOptions = removeCourseOption(course, newMultipleOptions)
    }

    setCheckboxedCourses(newCheckboxedCourses)
    setMultipleOptions(newMultipleOptions)
  }

  const isCourseSelected = (courseId: number) => {
    return checkboxedCourses.some((c) => c.id === courseId)
  }

  return (
        <div className="flex flex-col gap-4 pt-4 border-t mt-2">
            <div 
                className="flex items-center space-x-2 cursor-pointer select-none"
                onClick={() => setShowElectives(!showElectives)}
            >
                <ChevronRightIcon 
                    className={`h-4 w-4 transition-transform duration-200 ${showElectives ? 'rotate-90' : ''}`} 
                />
                <Label className="cursor-pointer">Competências Transversais</Label>
            </div>

            {showElectives && (
                 <div className="w-full border rounded-md p-4">
                    <div className="flex flex-col gap-2">
                        {electives.map((course) => (
                             <div key={course.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`elective-${course.id}`}
                                    checked={isCourseSelected(course.id)}
                                    onCheckedChange={(checked) => handleCheckedChange(course, checked as boolean)}
                                />
                                <Label htmlFor={`elective-${course.id}`} className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {course.name} ({course.acronym})
                                </Label>
                             </div>
                        ))}
                    </div>
                 </div>
            )}
        </div>
  )
}

export default Electives
