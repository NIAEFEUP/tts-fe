import { ImportedCourses } from "../../../../@types";
import { MultipleOptions } from "../../../../@types/new_index";

const fillOptions = (importedCourses: ImportedCourses, selectedOption: number, multipleOptions: MultipleOptions, setMultipleOptions: React.Dispatch<React.SetStateAction<MultipleOptions>>) => {

    const newMultipleOptions = [...multipleOptions];

    // This handles
    newMultipleOptions[selectedOption].course_options = newMultipleOptions[selectedOption].course_options.map((option) => {
        const optionIntValue = parseInt(importedCourses[option.course_id]);
        const newValue = isNaN(optionIntValue) ? null : optionIntValue;

        return { ...option, picked_class_id: newValue };
    });

    setMultipleOptions(newMultipleOptions)

    //setMultipleOptions((prevMultipleOptions) => {
       
        // We have to set the picked class_ids of the current multiple option to the imported course picked class id equivalent
        /*const newOptions = prevMultipleOptions.options.map((optionsArray, index) => {



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
        });*/

        /*const value = {
            index: prevMultipleOptions.index,
            selected: newOptions[prevMultipleOptions.index],
            options: newOptions,
        };

        return value;*/
    //});
}

export default fillOptions;