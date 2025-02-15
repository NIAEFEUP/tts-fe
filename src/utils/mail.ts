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
    goes_from: string,
    goes_to: string,
    course_acronym: string
}>) => {
    return items.map(item => `${item.participant_name ?? ""} (${item.participant_nmec}) pediu para trocar de ${item.goes_from} para ${item.goes_to} no curso ${item.course_acronym}.`).join("%0D%0A")
}

export const listEmailEnrollments = (items: Array<{
    participant_nmec: string,
    goes_to: string,
    course: Major,
    course_unit: CourseInfo
}>) => {
    return items.map(item => `${item.participant_nmec} pediu para ir para ${item.goes_to} (${item.course_unit.acronym}) no curso ${item.course.acronym}.`).join("%0D%0A")
}