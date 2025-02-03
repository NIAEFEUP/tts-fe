export const mailtoStringBuilder = (nmec: string | Array<string>) => {
    if (Array.isArray(nmec)) {
        let mailto = "mailto:"
        nmec.forEach(nmec => {
            mailto += `up${nmec}@up.pt,`
        })

        return mailto;
    }

    return `mailto:up${nmec}@up.pt`
}

export const listEmailExchanges = (items: Array<{
    goes_from: string,
    goes_to: string,
    course_acronym: string
}>) => {
    return items.map(item => `De ${item.goes_from} para ${item.goes_to} no curso ${item.course_acronym}.`).join("\n")
}