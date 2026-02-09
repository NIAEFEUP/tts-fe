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
    return items.map(item => `${item.participant_name ?? ""} (${item.participant_nmec}) pediu para trocar de turma na unidade curricular ${item.course_acronym}.`).join("%0D%0A")
}

export const listEmailEnrollments = (items: Array<{
    participant_nmec: string,
    goes_to: string,
    course_unit: CourseInfo
}>) => {
    return items.map(item => `${item.participant_nmec} pediu para ir para ${item.course_unit.acronym}.`).join("%0D%0A")
}