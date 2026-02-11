import { CourseInfo, Major } from "../@types";

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
    course_acronym: string

}>) => {
    if (items.length === 0) return "";

    const name = items[0].participant_name ?? "";
    const nmec = items[0].participant_nmec;
    const courses = items.map(item => item.course_acronym);

    let coursesFormatted: string;
    let label: string;

    if (courses.length === 1) {
        // Caso: Apenas 1 unidade curricular
        coursesFormatted = courses[0];
        label = "na unidade curricular";
    } else {
        // Caso: Múltiplas unidades curriculares
        const lastCourse = courses.pop();
        coursesFormatted = `${courses.join(", ")} e ${lastCourse}`;
        label = "nas unidades curriculares";
    }

    return `${name} (${nmec}) pediu para trocar de turma ${label} ${coursesFormatted}.`;
}

export const listEmailEnrollments = (items: Array<{
    participant_nmec: string,
    goes_to: string,
    course_unit: CourseInfo
}>) => {
    return items.map(item => `${item.participant_nmec} pediu para se inscrever ${item.course_unit.acronym}.`).join("%0D%0A")
}