import { useEffect, useState } from "react";
import { CourseInfo, Major, MultipleOptions } from "../@types";
import StorageAPI from "../api/storage";
import MultipleOptionsContext from "./MultipleOptionsContext";
import { ThemeContext } from "./ThemeContext";
import { useDarkMode } from "../hooks";
import useSession from "../hooks/useSession";
import SessionContext from "./SessionContext";
import MajorContext from "./MajorContext";
import CourseContext from "./CourseContext";

type Props = {
  children: React.JSX.Element
}

const CombinedProvider = ({ children }: Props) => {
  const [majors, setMajors] = useState<Major[]>([])
  const [coursesInfo, setCoursesInfo] = useState([]);
  const [pickedCourses, setPickedCourses] = useState<CourseInfo[]>(StorageAPI.getPickedCoursesStorage());
  const [checkboxedCourses, setCheckboxedCourses] = useState<CourseInfo[]>(StorageAPI.getPickedCoursesStorage());
  const [ucsModalOpen, setUcsModalOpen] = useState<boolean>(false);

  //TODO: Looks suspicious
  const [choosingNewCourse, setChoosingNewCourse] = useState<boolean>(false);

  const [enabled, setEnabled] = useDarkMode()  // TODO (Process-ing): Stop using a hook (who smoked here?)
  const [multipleOptions, setMultipleOptionsState] = useState<MultipleOptions>(StorageAPI.getMultipleOptionsStorage());
  const [selectedOption, setSelectedOptionState] = useState<number>(StorageAPI.getSelectedOptionStorage());

  const { signedIn: userSignedIn, user, isLoading: isSessionLoading } = useSession();

  const [signedIn, setSignedIn] = useState<boolean>(userSignedIn);
  useEffect(() => {
    setSignedIn(userSignedIn);
  }, [userSignedIn]);

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
    <SessionContext.Provider value={{ signedIn, setSignedIn, user, isSessionLoading }}>
      <ThemeContext.Provider value={{ enabled, setEnabled }}>
        <MajorContext.Provider value={{ majors, setMajors }}>
          <CourseContext.Provider value={
            {
              pickedCourses, setPickedCourses,
              coursesInfo, setCoursesInfo,
              checkboxedCourses, setCheckboxedCourses,
              choosingNewCourse, setChoosingNewCourse,
              ucsModalOpen, setUcsModalOpen
            }
          }>
            <MultipleOptionsContext.Provider value={{ multipleOptions, setMultipleOptions, selectedOption, setSelectedOption }}>
              {children}
            </MultipleOptionsContext.Provider>
          </CourseContext.Provider>
        </MajorContext.Provider>
      </ThemeContext.Provider>
    </SessionContext.Provider>
  );
};

export default CombinedProvider;
