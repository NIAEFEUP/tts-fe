import { BoltIcon } from '@heroicons/react/24/outline'
import { CourseOption, CourseSchedule, MultipleOptions } from '../../../../@types'
import { useContext, useEffect, useState, useMemo } from 'react'
import { Button } from '../../../ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'
import { ScrollArea } from '../../../ui/scroll-area'
import { Checkbox } from '../../../ui/checkbox'
import { Separator } from '../../../ui/separator'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { ClassInfo, SlotInfo } from '../../../../@types/new_index'

type Props = {
  className?: string
}

const RandomFill = ({ className }: Props) => {
  const { pickedCourses } = useContext(CourseContext)
  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext)
  const courseOptions = multipleOptions[selectedOption].course_options
  const [permutations, setPermutations] = useState([])
  const [lockedCourses, setLockedCourses] = useState(
    courseOptions.filter((course) => course.locked).map((course) => course.course_id)
  )

  console.log("picked courses is: ", pickedCourses);

  const getClasses = () => {
    let aux = []
    const option = multipleOptions[selectedOption]

    if (option) {
      for (let i = 0; i < option.course_options.length; i++) {
        const course_info = pickedCourses.find((course) => course.id === option.course_options[i].course_id)
        console.log("course_info keys 1: ", Object.keys(course_info));
        console.log("course_info: ", { ...course_info });
        console.log("course_info keys 2: ", Object.getOwnPropertyDescriptors(course_info));

        console.log("current picked courses: ", pickedCourses);
        console.log(`this should not be undefined ${course_info.classes}`)
        if (course_info && course_info.classes) {
          course_info.classes.forEach((class_info) => {
            aux.push({
              course_info: course_info,
              class_info: class_info,
            })
          })
        }
      }
    }

    return aux
  }

  const [classes, setClasses] = useState(getClasses());
  useEffect(() => {
    setClasses(getClasses());
  }, [multipleOptions, pickedCourses, selectedOption])

  const [randomClasses, setRandomClasses] = useState(
    Array.from(new Set(classes.map((class_info) => class_info.class_info.name)))
  )

  useEffect(() => {
    setRandomClasses(
      Array.from(new Set(classes.map((class_info) => class_info.class_info.name)))
    );
  }, [classes]);

  console.log("classes are: ", classes)

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

  // This is the function with problems
  const getSchedulesGenerator = () => {
    const allSchedules = courseOptions.map((course) => {
      if (course.locked) {
        return pickedCourses.find((picked) => picked.id === course.course_id).classes.find(
          (cls) => cls.id === course.picked_class_id
        )
      }

      const availableClasses = classes.filter((class_info) => {
        return randomClasses.includes(class_info.class_info.name)
      })

      return availableClasses
        .filter((class_info) => class_info.course_info.id === course.course_id)
        .map((class_info) => class_info.class_info)
    })

    console.log("all schedules: ", allSchedules);

    return cartesianGenerator(...allSchedules)
  }


  /*
    Function to check if a schedule is valid (no overlapping classes)
  */
  const isValidSchedule = (courses: SlotInfo[]) => {
    const schedules = courses
      .filter((slot) => slot !== null)
      .map((slot) => {
        return {
          day: slot.day,
          start_time: slot.start_time,
          duration: slot.duration,
        }
      })
      .sort((a, b) => {
        if (a.day === b.day) return a.start_time - b.start_time
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

    console.log("new permutations: ", newPermutations[randomNumber]);
    applySchedule(newPermutations[randomNumber])
    setPermutations(newPermutations)
  }

  const applySchedule = (schedules: ClassInfo[]) => {
    if (schedules.length <= 0) return

    setMultipleOptions((prevMultipleOptions) => {
      const newMultipleOptions = [...prevMultipleOptions]

      const selectedOptionCopy = { ...newMultipleOptions[selectedOption] }

      if (!selectedOptionCopy.course_options) {
        console.error('course_options is undefined in selectedOptionCopy.')
        return prevMultipleOptions
      }

      const newCourseOptions = selectedOptionCopy.course_options.map((course) => {
        if (course.locked) return course
        
        console.log("current schedules is: ", schedules);

        const matchedSchedule = schedules?.find((schedule) => schedule.course_unit_id === course.course_id)

        console.log("matched schedules: ", matchedSchedule);

        if (matchedSchedule) {
          return {
            ...course,
            picked_class_id: matchedSchedule.id,
          }
        }
        return course
      })

      console.log("new course options xxx: ", newCourseOptions);

      selectedOptionCopy.course_options = newCourseOptions
      console.log("selected option copy: ", selectedOptionCopy);
      newMultipleOptions[selectedOption] = selectedOptionCopy
      console.log("")

      console.log("new multiple options: ", newMultipleOptions);

      return newMultipleOptions
    })
  }

  const toggleRandomClasses = (event) => {
    const className = event.target.id
    setRandomClasses((prevRandomClasses) => {
      if (prevRandomClasses.includes(className)) {
        return prevRandomClasses.filter((name) => name !== className)
      } else {
        return [...prevRandomClasses, className]
      }
    })
  }

  /**
   * Updating randomClasses and lockedCourses when:
   * - Multiple options change
   */
  useEffect(() => {
    if (randomClasses.length !== 0) return

    const newMultipleOptions = [...multipleOptions]
    const selected = newMultipleOptions[selectedOption]?.course_options

    const classes = [
      ...new Set(selected?.map((course) => course.picked_class_id).flat())
    ]

    setRandomClasses(classes)
  }, [multipleOptions, pickedCourses, selectedOption])


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
   * - Selected classes for random generations change
   * - Picked courses change
   */
  useEffect(() => {
    setPermutations([])
    setGenerator(getSchedulesGenerator())
  }, [selectedOption, pickedCourses, randomClasses])

  const [generator, setGenerator] = useState(getSchedulesGenerator())



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
            {Array.from(new Set(classes.map((class_info) => class_info.class_info.name))).map((key) => (
              <div
                key={key}
                className="mt-1 flex items-center space-x-2 rounded p-1 hover:cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-700"
              >
                <Checkbox id={key} checked={randomClasses.includes(key)} onClick={toggleRandomClasses} />
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
