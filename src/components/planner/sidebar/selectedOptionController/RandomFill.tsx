import { BoltIcon } from '@heroicons/react/24/outline'
import { ClassInfo, SlotInfo } from '../../../../@types'
import { useContext, useEffect, useState, useMemo } from 'react'
import { Button } from '../../../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'
import { ScrollArea } from '../../../ui/scroll-area'
import { Checkbox } from '../../../ui/checkbox'
import { Separator } from '../../../ui/separator'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'

type Props = {
  className?: string
}

type SlotMetadata = {
  day: number,
  start_time: number,
  duration: number
}

const RandomFill = ({ className }: Props) => {
  const { pickedCourses } = useContext(CourseContext)
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const courseOptions = multipleOptions[selectedOption].course_options
  const [permutations, setPermutations] = useState([])
  const [lockedCourses, setLockedCourses] = useState(
    courseOptions.filter((course) => course.locked).map((course) => course.course_id)
  )

  // Get all course_unit-class combinations
  const getClassesCombinations = () => {
    return pickedCourses.map((course) => {
      if (!course.classes) return []
      return course.classes.map((cls) => {
        return {
          course_info: course,
          class_info: cls,
        }
      })
    }).flat()
  }

  const [classesCombinations, setClassesCombinations] = useState([]);
  useEffect(() => {
    const combinations = getClassesCombinations()
    setClassesCombinations(combinations);
  }, [pickedCourses, selectedOption]);

  const getUniqueClasses = () => {
    return Array.from(new Set(classesCombinations.map((class_info) => class_info.class_info.name)))
  }

  // not a good name
  const [uniqueClasses, setUniqueClasses] = useState(getUniqueClasses())
  useEffect(() => {
    setUniqueClasses(getUniqueClasses())
  }, [classesCombinations])

  /* 
  Usage:
   
  ~~~~~~~~~~~~~~~~~~~~~~~~~
    const generator = cartesianGenerator(...schedules); 
    const combination = generator.next().value;
  */
  function* cartesianGenerator(...arrays) {
    if (arrays.length === 0) {
      yield []
      return
    }

    const [head, ...tail] = arrays

    if (head.length === 0) {
      for (const t of cartesianGenerator(...tail)) {
        yield [null, ...t]
      }
      return
    }

    for (const h of head) {
      for (const t of cartesianGenerator(...tail)) {
        if (isValidSchedule([h, ...t])) {
          yield [h, ...t]
        }
      }
    }
  }

  const getSchedulesGenerator = () => {
    const allSchedules = courseOptions.map((course) => {
      if (course.locked && course.picked_class_id) {
        return [pickedCourses.find((picked) => picked.id === course.course_id)?.classes.find(
          (cls) => cls.id === course.picked_class_id
        )]
      }

      const availableClasses = classesCombinations.filter((class_info) => {
        return uniqueClasses.includes(class_info.class_info.name)
      })

      return availableClasses
        .filter((class_info) => class_info.course_info.id === course.course_id)
        .map((class_info) => class_info.class_info)
    })

    return cartesianGenerator(...allSchedules)
  }

  const [generator, setGenerator] = useState(getSchedulesGenerator())

  /*
    Function to check if a schedule is valid (no overlapping classesCombinations)
  */
  const isValidSchedule = (courses: ClassInfo[]) => {
    const schedules = courses
      .filter((classInfo) => classInfo !== null)
      .map((classInfo) => {
        return classInfo.slots.map((slot) => {
          return {
            day: slot.day,
            start_time: slot.start_time,
            duration: slot.duration,
          }
        })
      }).flat()
      .sort((a: SlotMetadata, b: SlotMetadata) => {
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
    const newPermutations = [...permutations]
    const STEP = 1000; //TODO(thePeras): Not a good number for a big number of pickedCourses
    for (let i = 0; i < STEP; i++) {
      const permutation = generator.next().value
      if (!permutation) break
      newPermutations.push(permutation)
    }
    setPermutations(newPermutations)

    // Choose a random permutation
    const randomNumber = Math.floor(Math.random() * (newPermutations.length - 1))
    applySchedule(newPermutations[randomNumber])
  }

  const applySchedule = (classesCombinations: ClassInfo[]) => {
    if (classesCombinations.length <= 0) return

    setMultipleOptions((prevMultipleOptions) => {
      const newMultipleOptions = [...prevMultipleOptions]
      const selectedOptionCopy = { ...newMultipleOptions[selectedOption] }

      if (!selectedOptionCopy.course_options) {
        console.error('course_options is undefined in selectedOptionCopy.')
        return prevMultipleOptions
      }

      const newCourseOptions = selectedOptionCopy.course_options.map((course) => {
        if (course.locked) return course

        for (const classInfo of classesCombinations) {
          if (!classInfo) continue

          const courseUnit = pickedCourses.find((other_course) => other_course.course_unit_id === course.course_id);
          const matchedClassInfo = courseUnit.classes.find((courseUnitClass) => courseUnitClass.id === classInfo.id);
          if (matchedClassInfo) {
            return {
              ...course,
              picked_class_id: matchedClassInfo.id,
            }
          }
        }

        return course
      })

      selectedOptionCopy.course_options = newCourseOptions
      newMultipleOptions[selectedOption] = selectedOptionCopy

      return newMultipleOptions
    })
  }

  const toggleRandomClasses = (event) => {
    const className = event.target.id
    setUniqueClasses((prevRandomClasses) => {
      if (prevRandomClasses.includes(className)) {
        return prevRandomClasses.filter((name) => name !== className)
      } else {
        return [...prevRandomClasses, className]
      }
    })
  }

  /**
   * Reseting generator and permutations when:
   * -
   */
  useEffect(() => {
    const newMultipleOptions = [...multipleOptions]

    const selected = newMultipleOptions[selectedOption]?.course_options
    // Updating locked courses
    const newLockedCourses = selected?.filter((course) => course.locked)
      .map((course) => course.course_id)
    // Only update if locked courses changed
    if (newLockedCourses?.join() !== lockedCourses?.join()) {
      setLockedCourses(newLockedCourses)
      setPermutations([])
      setGenerator(getSchedulesGenerator())
    }
  }, [multipleOptions, selectedOption, lockedCourses])

  /**
   * Reseting generator and permutations when:
   * - Selected option changes
   * - Selected classesCombinations for random generations change
   * - Picked courses change
   */
  useEffect(() => {
    setPermutations([])
    setGenerator(getSchedulesGenerator())
  }, [pickedCourses, uniqueClasses])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={applyRandomSchedule}
            variant="icon"
            className={`${className} h-min w-min flex-grow bg-secondary`}
          >
            <BoltIcon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" asChild>
          <ScrollArea className="mx-5 h-72 rounded px-3">
            <div className="p-1">Preenchimento aleatório</div>
            <Separator />
            {Array.from(new Set(classesCombinations.map((class_info) => class_info.class_info.name))).map((key) => (
              <div
                key={key}
                className="mt-1 flex items-center space-x-2 rounded p-1 hover:cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-700"
              >
                <Checkbox id={key} checked={uniqueClasses.includes(key)} onClick={toggleRandomClasses} />
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