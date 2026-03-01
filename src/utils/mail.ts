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

    const participants = Array.from(new Map(items.map(item => [item.participant_nmec, item.participant_name])).entries());
    
    const firstNames = participants.map(([, name]) => name.split(' ')[0]);
    let greeting = `Olá ${firstNames[0]}`;
    if (firstNames.length > 1) {
        const lastPref = firstNames.pop();
        greeting = `Olá ${firstNames.join(", ")} e ${lastPref}`;
    }

    const detailedCourses = items.map(item => 
        `${item.course_acronym} (${item.goes_from} ${participants.length > 1 ? '<->' : 'para'} ${item.goes_to})`
    );

    let coursesFormatted: string;
    if (detailedCourses.length === 1) {
        coursesFormatted = detailedCourses[0];
    } else {
        const lastCourse = detailedCourses.pop();
        coursesFormatted = `${detailedCourses.join(", ")} e ${lastCourse}`;
    }

    let description = "";
    if (participants.length === 1) {
        const [nmec, name] = participants[0];
        description = `${name} (${nmec}) pediu para alterar turma de ${coursesFormatted}.`;
    } else {
        const details = participants.map(([nmec, name]) => `${name} (${nmec})`).join(" e ");
        
        description = `${details} pediram para trocar de turmas em ${coursesFormatted}.`;
    }

    return `${greeting},%0D%0A%0D%0A${description}`;
}
export const listEmailEnrollments = (items: Array<{
    participant_nmec: string,
    participant_name?: string,
    goes_to: string,
    course_unit: CourseInfo
}>) => {
    if (items.length === 0) return "";

    const fullName = items[0].participant_name ?? "";
    const firstName = fullName.split(' ')[0];
    const nmec = items[0].participant_nmec;
    
    const courseAcronyms = items.map(item => item.course_unit.acronym);

    let coursesFormatted: string;

    if (courseAcronyms.length === 1) {
        coursesFormatted = courseAcronyms[0];
    } else {
        const lastCourse = courseAcronyms.pop();
        coursesFormatted = `${courseAcronyms.join(", ")} e ${lastCourse}`;
    }

    const greeting = firstName ? `Olá ${firstName},` : "Olá,";

    return `${greeting}%0D%0A%0D%0A${fullName} (${nmec}) pediu turmas em ${coursesFormatted}.`;
}