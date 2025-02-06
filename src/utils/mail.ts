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
    goes_from: string,
    goes_to: string,
    course_acronym: string
}>) => {
    return items.map(item => `${item.participant_nmec} pediu para trocar de ${item.goes_from} para ${item.goes_to} no curso ${item.course_acronym}.`).join("%0D%0A")
}

export const listEmailEnrollments = (items: Array<{
    participant_nmec: string,
    goes_to: string,
    course: number,
    course_unit_id: number
}>) => {
    return items.map(item => `${item.participant_nmec} pediu para ir para ${item.goes_to} (${item.course_unit_id}) no curso ${item.course}.`).join("%0D%0A")
}