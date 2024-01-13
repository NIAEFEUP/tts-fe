import { BoltIcon } from '@heroicons/react/24/outline'
import { CourseOption, CourseSchedule, MultipleOptions } from '../../../../@types'
import { useEffect, useState } from 'react'
import { removeDuplicatesFromCourseOption } from '../../../../utils/utils'
import { Button } from '../../../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'
import { ToggleGroup, ToggleGroupItem } from '../../../ui/toggle-group'
import { Separator } from '../../../ui/separator'
import { ScrollArea } from '../../../ui/scroll-area'

type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const RandomFill = ({ multipleOptionsHook }) => {
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const courseOptions = removeDuplicatesFromCourseOption(multipleOptions.selected)

  const [permutations, setPermutations] = useState([])
  const [lockedCourses, setLockedCourses] = useState(
    courseOptions.filter((course) => course.locked).map((course) => course.course.info.acronym)
  )

  useEffect(() => {
    const newLockedCourses = multipleOptions.selected
      .filter((course) => course.locked)
      .map((course) => course.course.info.acronym)
    // Only update if locked courses changed
    if (newLockedCourses.join() != lockedCourses.join()) {
      setLockedCourses(newLockedCourses)
    }
  }, [multipleOptions])

  /* 
  Usage:
    const generator = cartesianGenerator(...schedules); 
    const combination = generator.next().value;
  */
  function* cartesianGenerator(...a) {
    if (a.length === 0) {
      yield []
      return
    }

    const [head, ...tail] = a

    for (const h of head) {
      for (const t of cartesianGenerator(...tail)) {
        if (!isValidSchedule([h, ...t])) continue

        yield [h, ...t]
      }
    }
  }

  const getSchedulesGenerator = () => {
    const allSchedules = courseOptions.map((course) => {
      if (course.locked) {
        return [course.option]
      }
      return course.schedules.filter((schedule) => schedule.lesson_type != 'T')
    })

    return cartesianGenerator(...allSchedules)
  }
  const [generator, setGenerator] = useState(getSchedulesGenerator())

  // Reset generator when locked courses changes as it will change the possible schedules
  useEffect(() => {
    setPermutations([])
    setGenerator(getSchedulesGenerator())
  }, [lockedCourses])

  /*
    Function to check if a schedule is valid (no overlapping classes)
  */
  const isValidSchedule = (courses: CourseSchedule[]) => {
    //
    const schedules = courses
      .map((schedule) => {
        return {
          day: schedule.day,
          start_time: parseFloat(schedule.start_time),
          duration: parseFloat(schedule.duration),
        }
      })
      .sort((a, b) => {
        if (a.day == b.day) return a.start_time - b.start_time
        return a.day - b.day
      })

    for (let i = 0; i < schedules.length; i++) {
      const schedule = schedules[i]
      const nextSchedule = schedules[i + 1]
      if (!nextSchedule) return true

      if (schedule.day == nextSchedule.day) {
        if (schedule.start_time == nextSchedule.start_time) {
          return false
        } else if (schedule.start_time < nextSchedule.start_time) {
          if (schedule.start_time + schedule.duration > nextSchedule.start_time) {
            return false
          }
        } else {
          if (nextSchedule.start_time + nextSchedule.duration > schedule.start_time) {
            return false
          }
        }
      }
    }
    return true
  }

  const applyRandomSchedule = () => {
    let newPermutations = [...permutations]
    const STEP = 10000
    for (let i = 0; i < STEP; i++) {
      const permutation = generator.next().value
      if (!permutation) {
        console.log('No more permutations')
        break
      }
      newPermutations.push(permutation)
    }

    const randomNumber = Math.floor(Math.random() * (newPermutations.length - 1))

    applySchedule(newPermutations[randomNumber])
    setPermutations(newPermutations)
  }

  const applySchedule = (schedules: CourseSchedule[]) => {
    //console.log of composed_class_name of each course
    console.log(schedules.map((schedule) => schedule.composed_class_name))
    if (schedules.length <= 0) return

    setMultipleOptions((prevMultipleOptions) => {
      const selected = prevMultipleOptions.selected

      const newSelected = selected.map((course, index) => {
        let newCourse = course
        newCourse.option = schedules[index]
        return newCourse
      })

      const value = {
        index: prevMultipleOptions.index,
        selected: [...newSelected],
        options: prevMultipleOptions.options,
        names: prevMultipleOptions.names,
      }

      return value
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button onClick={applyRandomSchedule} variant="icon" className="h-min w-min bg-secondary xl:p-1">
            <BoltIcon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className='p-0 mx-5'>
          <ScrollArea className="h-72 rounded-md border p-3">
            <ToggleGroup type="multiple" className="flex-col" data-orientation="vertical">
              {courseOptions[0]?.schedules
                .filter((course) => course.lesson_type != 'T')
                .map((course: CourseSchedule, index: number) => {
                  return (
                    <ToggleGroupItem value={course.class_name} key={course.class_name}>
                      {course.class_name}
                    </ToggleGroupItem>
                  )
                })}
            </ToggleGroup>
          </ScrollArea>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default RandomFill
