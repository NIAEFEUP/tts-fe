import { useState } from "react";
import { CourseInfo, Major, MultipleOptions } from "../@types";
import StorageAPI from "../api/storage";
import MultipleOptionsContext from "./MultipleOptionsContext";
import { ThemeContext } from "./ThemeContext";
import { useDarkMode } from "../hooks";
import CourseContext from "./CourseContext";
import MajorContext from "./MajorContext";

const CombinedProvider = ({ children }) => {
  const [enabled, setEnabled] = useDarkMode()  // TODO (Process-ing): Stop using a hook (who smoked here?)
  const [multipleOptions, setMultipleOptionsState] = useState<MultipleOptions>(StorageAPI.getMultipleOptionsStorage());
  const [selectedOption, setSelectedOptionState] = useState<number>(StorageAPI.getSelectedOptionStorage());
  const [majors, setMajors] = useState<Major[]>([])
  const [coursesInfo, setCoursesInfo] = useState([]);
  const [pickedCourses, setPickedCourses] = useState<CourseInfo[]>(StorageAPI.getPickedCoursesStorage());
  const [checkboxedCourses, setCheckboxedCourses] = useState<CourseInfo[]>(StorageAPI.getPickedCoursesStorage());
  const [choosingNewCourse, setChoosingNewCourse] = useState<boolean>(false);
  

  const setMultipleOptions = (newMultipleOptions: MultipleOptions | ((prevMultipleOptions: MultipleOptions) => MultipleOptions)) => {
    if (newMultipleOptions instanceof Function)
      newMultipleOptions = newMultipleOptions(multipleOptions);

    setMultipleOptionsState(newMultipleOptions);
    StorageAPI.setMultipleOptionsStorage(newMultipleOptions);
  }

  const setSelectedOption = (newOption: number | ((prevOption: number) => number)) => {
    if (newOption instanceof Function)
      newOption = newOption(selectedOption);

    setSelectedOptionState(newOption);
    StorageAPI.setSelectedOptionStorage(newOption);
  }

  return (
    <ThemeContext.Provider value={{ enabled, setEnabled }}>
      <MultipleOptionsContext.Provider value={{ multipleOptions, setMultipleOptions, selectedOption, setSelectedOption }}>
        <MajorContext.Provider value={{ majors, setMajors }}>
          <CourseContext.Provider value={
            {
              pickedCourses, setPickedCourses,
              coursesInfo, setCoursesInfo,
              checkboxedCourses, setCheckboxedCourses,
              choosingNewCourse, setChoosingNewCourse
            }
          }>
            {children}
          </CourseContext.Provider>
        </MajorContext.Provider>
      </MultipleOptionsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default CombinedProvider;