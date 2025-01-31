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

export const rejectEmailExchanges = (items: Array<{
    goes_from: string,
    goes_to: string,
    course_acronym: string
}>) => {
    let msg: string = "Foi rejeitado o seguinte pedido de troca de turmas:\n"

    for (const item of items) {
        msg += `De ${item.goes_from} para ${item.goes_to} no curso ${item.course_acronym}\n`
    }

    return msg;
}