import { useEffect, useState } from "react";
import { Major, MultipleOptions, PickedCourses } from "../@types/new_index";
import { useDarkMode } from "../hooks";
import { ThemeContext } from "./ThemeContext";
import MultipleOptionsContext from "./MultipleOptionsContext";
import BackendAPI from "../api/backend";
import StorageAPI from "../api/storage";
import MajorContext from "./MajorContext";
import CourseContext from "./CourseContext";

const CombinedProvider = ({ children }) => {
  const [enabled, setEnabled] = useDarkMode()  // TODO (Process-ing): Stop using a hook (who smoked here?)

  const [multipleOptions, setMultipleOptionsState] = useState<MultipleOptions>(StorageAPI.getMultipleOptionsStorage());
  const [selectedOption, setSelectedOptionState] = useState<number>(StorageAPI.getSelectedOptionStorage());

  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajor, setSelectedMajorState] = useState(StorageAPI.getSelectedMajorStorage());

  const [coursesInfo, setCoursesInfo] = useState(StorageAPI.getCoursesInfoStorage());
  const [pickedCourses, setPickedCoursesState] = useState(StorageAPI.getPickedCoursesStorage());

  const [choosingNewCourse, setChoosingNewCourse] = useState<boolean>(false);
  
  useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
      StorageAPI.setMajorsStorage(majors)
    })
  }, []);

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

  const setPickedCourses = (newPickedCourses: PickedCourses) => {
    setPickedCoursesState(newPickedCourses);
    StorageAPI.setPickedCoursesStorage(newPickedCourses);

    //TODO (thePeras): Looks suspicious
    if (pickedCourses.length !== 0) BackendAPI.getCoursesClasses(pickedCourses)
  }

  const setSelectedMajor = (newMajor: Major) => {
    BackendAPI.getCourses(newMajor).then((courses) => {
      setCoursesInfo(courses);
    })
    setSelectedMajorState(newMajor);
  };

  return (
    <ThemeContext.Provider value={{ enabled, setEnabled }}>
      <MultipleOptionsContext.Provider value={{ multipleOptions, setMultipleOptions, selectedOption, setSelectedOption }}>
        <MajorContext.Provider value={{ majors, setMajors, selectedMajor, setSelectedMajor }}>
          <CourseContext.Provider value={{ pickedCourses, setPickedCourses, coursesInfo, setCoursesInfo, choosingNewCourse, setChoosingNewCourse }}>
            {children}
          </CourseContext.Provider>
        </MajorContext.Provider>
      </MultipleOptionsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default CombinedProvider;