import { CourseInfo} from "../@types";

export const mailtoStringBuilder = (nmec: string | Array<string>) => {
    if (Array.isArray(nmec)) {
        let mailto = "mailto:"
        nmec.forEach(nmec => {
            mailto += `up${nmec}@up.pt;`
        })

        return mailto.slice(0, -1);
    }

    return `mailto:up${nmec}@up.pt`
}

export const listEmailExchanges = (items: Array<{
    participant_nmec: string,
    participant_name: string,
    goes_from: string,
    goes_to: string,
    course_acronym: string
}>) => {
    if (items.length === 0) return "";

    const name = items[0].participant_name ?? "";
    const nmec = items[0].participant_nmec;

    const detailedCourses = items.map(item => 
        `${item.course_acronym} (${item.goes_from} para ${item.goes_to})`
    );

    let coursesFormatted: string;
    let label: string;

    if (detailedCourses.length === 1) {
        coursesFormatted = detailedCourses[0];
        label = "na unidade curricular";
    } else {
        const lastCourse = detailedCourses.pop();
        coursesFormatted = `${detailedCourses.join(", ")} e ${lastCourse}`;
        label = "nas unidades curriculares";
    }

    return `${name} (${nmec}) pediu para trocar de turma ${label} ${coursesFormatted}.`;
}


export const listEmailEnrollments = (items: Array<{
    participant_nmec: string,
    participant_name?: string,
    goes_to: string,
    course_unit: CourseInfo
}>) => {
    if (items.length === 0) return "";

    const name = items[0].participant_name ?? "";
    const nmec = items[0].participant_nmec;
    
    const courseAcronyms = items.map(item => item.course_unit.acronym);

    let coursesFormatted: string;
    let label: string;

    if (courseAcronyms.length === 1) {
        coursesFormatted = courseAcronyms[0];
        label = "na unidade curricular";
    } else {
        const lastCourse = courseAcronyms.pop();
        coursesFormatted = `${courseAcronyms.join(", ")} e ${lastCourse}`;
        label = "nas unidades curriculares";
    }

    return `${name} (${nmec}) pediu para se inscrever ${label} ${coursesFormatted}.`;
}