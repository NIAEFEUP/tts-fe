import { ImportedCourses, MultipleOptions } from "../../../../@types";

const fillOptions = (importedCourses: ImportedCourses, setMultipleOptions: React.Dispatch<React.SetStateAction<MultipleOptions>>) => {
    setMultipleOptions((prevMultipleOptions) => {
        const newOptions = prevMultipleOptions.options.map((optionsArray, index) => {
            if (index !== prevMultipleOptions.index) {
                return optionsArray; // Keep other options unchanged
            }

            // Cleaning the previous options
            optionsArray = optionsArray.map((courseOption) => {
                return { ...courseOption, option: null, locked: false };
            })

            return optionsArray.map((courseOption) => {
                const courseUnitId = courseOption.course.info.course_unit_id;
                const importingScheduleClassName = importedCourses[courseUnitId];

                if (importingScheduleClassName === undefined || importingScheduleClassName === 'null') {
                    return courseOption;
                }

                const newOption = courseOption.schedules.find((schedule) => schedule.class_name === importingScheduleClassName);
                if (newOption === undefined) {
                    console.log("Invalid option for course unit: " + courseUnitId);
                    return courseOption;
                }

                return { ...courseOption, option: newOption, locked: false };
            });
        });

        const value = {
            index: prevMultipleOptions.index,
            selected: newOptions[prevMultipleOptions.index],
            options: newOptions,
        };

        return value;
    });
}

export default fillOptions;
