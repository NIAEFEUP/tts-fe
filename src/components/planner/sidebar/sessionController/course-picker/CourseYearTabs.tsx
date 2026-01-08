import { useContext, useState, useMemo } from 'react'
import { ScrollArea } from '../../../../ui/scroll-area'
import CoursePickerContext from '../../../../../contexts/coursePicker/CoursePickerContext'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import { groupCoursesByYear, removeCourseOption, addCourseOption, replaceCourseOptions } from '../../../../../utils'
import { NoMajorSelectedSVG } from '../../../../svgs'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../../../ui/tabs'
import { CourseInfo } from '../../../../../@types'
import { Checkbox } from '../../../../ui/checkbox'
import { Label } from '../../../../ui/label'

const CourseYearTabs = () => {
  const { coursesInfo, checkboxedCourses, setCheckboxedCourses } = useContext(CoursePickerContext)
  const { setMultipleOptions, multipleOptions } = useContext(MultipleOptionsContext)
  const [selectedTab, setSelectedTab] = useState('1')
  
  const coursesByYear = useMemo(() => groupCoursesByYear(coursesInfo), [coursesInfo])

  const getYearStatus = (yearIndex: number) => {
    const yearCourses = coursesByYear[yearIndex]
    if (!yearCourses || yearCourses.length === 0) {
      return { checked: false, indeterminate: false }
    }

    const selectedCount = yearCourses.filter((course: CourseInfo) =>
      checkboxedCourses.some((c: CourseInfo) => c.id === course.id)
    ).length

    if (selectedCount === 0) {
      return { checked: false, indeterminate: false }
    }
    if (selectedCount === yearCourses.length) {
      return { checked: true, indeterminate: false }
    }
    return { checked: false, indeterminate: true }
  }

  const toggleYear = (yearIndex: number, shouldSelect: boolean) => {
    const yearCourses = coursesByYear[yearIndex]
    if (!yearCourses) return

    let newCheckboxedCourses = [...checkboxedCourses]

    if (shouldSelect) {
      yearCourses.forEach((course: CourseInfo) => {
        if (!newCheckboxedCourses.some((c: CourseInfo) => c.id === course.id)) {
          newCheckboxedCourses.push(course)
        }
      })
    } else {
      newCheckboxedCourses = newCheckboxedCourses.filter(
        (course: CourseInfo) => course.course_unit_year !== yearIndex + 1
      )
    }

    setMultipleOptions(replaceCourseOptions(newCheckboxedCourses, multipleOptions))
    setCheckboxedCourses(newCheckboxedCourses)
  }

  const toggleCourse = (course: CourseInfo) => {
    if (checkboxedCourses.some((c: CourseInfo) => c.id === course.id)) {
      setMultipleOptions(removeCourseOption(course, multipleOptions))
      setCheckboxedCourses(checkboxedCourses.filter((c: CourseInfo) => c.id !== course.id))
    } else {
      setCheckboxedCourses([...checkboxedCourses, course])
      setMultipleOptions(addCourseOption(course, multipleOptions))
    }
  }

  const isCourseSelected = (course: CourseInfo) => {
    return checkboxedCourses.some((c: CourseInfo) => c.id === course.id)
  }

  return coursesByYear.length > 0 ? (
    <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
      <TabsList className="w-full">
        {coursesByYear.map((_, idx) => (
          <TabsTrigger
            className="select-none"
            key={idx}
            value={`${idx + 1}`}
          >
            {`${idx + 1}º Ano`}
          </TabsTrigger>
        ))}
      </TabsList>
      {coursesByYear.map((yearCourses, idx) => {
        const yearStatus = getYearStatus(idx)
        
        return (
          <TabsContent key={idx} value={`${idx + 1}`}>
            <ScrollArea className="h-[200px]">
              <div className="flex flex-col gap-2 p-4">
                {/* Select All checkbox for this year */}
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`select-all-year-${idx}`}
                    checked={yearStatus.checked}
                    indeterminate={yearStatus.indeterminate}
                    onCheckedChange={(checked) => {
                      const shouldSelect = yearStatus.indeterminate ? true : checked === true
                      toggleYear(idx, shouldSelect)
                    }}
                  />
                  <Label
                    htmlFor={`select-all-year-${idx}`}
                    className="font-medium hover:cursor-pointer"
                  >
                    Selecionar Todas
                  </Label>
                </div>

                {yearCourses
                  .sort((a: CourseInfo, b: CourseInfo) => b.ects - a.ects)
                  .map((course: CourseInfo) => (
                    <div
                      key={`course-checkbox-${course.course_unit_year}-${course.id}`}
                      className="flex items-center space-x-2 ml-6"
                    >
                      <Checkbox
                        id={`checkbox-${course.id}`}
                        title={course.name}
                        checked={isCourseSelected(course)}
                        onCheckedChange={() => toggleCourse(course)}
                      />
                      <Label
                        htmlFor={`checkbox-${course.id}`}
                        className="text-wrap leading-normal hover:cursor-pointer"
                      >
                        {course.name} ({course.acronym})
                      </Label>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        )
      })}
    </Tabs>
  ) : (
    <div className="flex items-center justify-center">
      <NoMajorSelectedSVG />
    </div>
  )
}

export default CourseYearTabs
