import { BoltIcon } from '@heroicons/react/24/outline'
import { CourseOption, CourseSchedule, MultipleOptions } from '../../../../@types'
import { useEffect, useState } from 'react'
import { removeDuplicatesFromCourseOption } from '../../../../utils/utils'
import { Button } from '../../../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'
import { ScrollArea } from '../../../ui/scroll-area'
import { Checkbox } from '../../../ui/checkbox'
import { Separator } from '../../../ui/separator'

type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
  className?: string
}

const RandomFill = ({ multipleOptionsHook, className }: Props) => {
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const courseOptions = removeDuplicatesFromCourseOption(multipleOptions.selected)
  const [permutations, setPermutations] = useState([])
  const [lockedCourses, setLockedCourses] = useState(
    courseOptions.filter((course) => course.locked).map((course) => course.course.info.acronym)
  )
  const [randomClasses, setRandomClasses] = useState({})

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

    if (head.length === 0) {
      for (const t of cartesianGenerator(...tail)) {
        yield [null, ...t]
      }
      return
    }

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
      return course.schedules.filter((schedule) => schedule.lesson_type != 'T' && randomClasses[schedule.class_name])
    })

    return cartesianGenerator(...allSchedules)
  }

  /*
    Function to check if a schedule is valid (no overlapping classes)
  */
  const isValidSchedule = (courses: CourseSchedule[]) => {
    const schedules = courses
      .filter((schedule) => schedule !== null)
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
      if (!permutation) break
      newPermutations.push(permutation)
    }

    const randomNumber = Math.floor(Math.random() * (newPermutations.length - 1))

    applySchedule(newPermutations[randomNumber])
    setPermutations(newPermutations)
  }

  const applySchedule = (schedules: CourseSchedule[]) => {
    if (schedules.length <= 0) return

    setMultipleOptions((prevMultipleOptions) => {
      const selected = prevMultipleOptions.selected

      const newSelected = selected.map((course, index) => {
        let newCourse = course
        newCourse.option = schedules[index] ?? null
        return newCourse
      })

      const value = {
        index: prevMultipleOptions.index,
        selected: [...newSelected],
        options: prevMultipleOptions.options,
      }

      return value
    })
  }

  const toggleRandomClasses = (event) => {
    setRandomClasses((prevRandomClasses) => {
      const newRandomClasses = { ...prevRandomClasses }
      newRandomClasses[event.target.id] = !newRandomClasses[event.target.id]
      return newRandomClasses
    })
  }

  /**
   * Updating randomClasses and lockedCourses when:
   * - Multiple options change
   */
  useEffect(() => {
    // ------------------------------------------------------
    // Updating all class names of the selected courses
    if (Object.keys(randomClasses).length !== 0) return
    const selected = multipleOptions.selected

    const classes = [
      ...new Set(
        selected
          .map((course) =>
            course.schedules.filter((schedule) => schedule.lesson_type != 'T').map((schedule) => schedule.class_name)
          )
          .flat()
      ),
    ]

    const keyValue = {}
    classes.forEach((class_name) => {
      keyValue[class_name] = true
    })

    setRandomClasses(keyValue)
  }, [multipleOptions])

  /**
   * Reseting generator and permutations when:
   * -
   */
  useEffect(() => {
    // ------------------------------------------------------
    // Updating locked courses
    const newLockedCourses = multipleOptions.selected
      .filter((course) => course.locked)
      .map((course) => course.course.info.acronym)
    // Only update if locked courses changed
    if (newLockedCourses.join() !== lockedCourses.join()) {
      setLockedCourses(newLockedCourses)
      setPermutations([])
      setGenerator(getSchedulesGenerator())
    }
  }, [multipleOptions])

  /**
   * Reseting generator and permutations when:
   * - Selected option changes
   * - Selected classes for random generations change
   */
  useEffect(() => {
    setPermutations([])
    setGenerator(getSchedulesGenerator())
  }, [multipleOptions.index, randomClasses])

  const [generator, setGenerator] = useState(getSchedulesGenerator())

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={applyRandomSchedule}
            variant="icon"
            className={className.concat(' h-min w-min flex-grow bg-secondary')}
          >
            <BoltIcon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" asChild>
          <ScrollArea className="mx-5 h-72 rounded px-3">
            <div className="p-1">Preenchimento aleatório</div>
            <Separator />
            {Object.keys(randomClasses).map((key) => (
              <div
                key={key}
                className="mt-1 flex items-center space-x-2 rounded p-1 hover:cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-700"
              >
                <Checkbox id={key} checked={randomClasses[key]} onClick={toggleRandomClasses} />
                <label
                  htmlFor={key}
                  className="text-sm font-medium leading-none hover:cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {key}
                </label>
              </div>
            ))}
          </ScrollArea>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default RandomFill
