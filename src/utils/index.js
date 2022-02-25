export function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export const courseSchedules = [
    { class: "3MIEIC01", time: "09:00-11:00", weekday: "2ªf", teacher: "RGR" },
    { class: "3MIEIC02", time: "09:30-11:30", weekday: "2ªf", teacher: "PFS" },
    { class: "3MIEIC03", time: "10:30-12:30", weekday: "2ªf", teacher: "SFCF" },
    { class: "3MIEIC04", time: "11:00-13:00", weekday: "4ªf", teacher: "SFCF" },
    { class: "3MIEIC05", time: "11:00-13:00", weekday: "4ªf", teacher: "RGR" },
    { class: "3MIEIC06", time: "14:00-16:00", weekday: "6ªf", teacher: "RGR" },
    { class: "3MIEIC07", time: "14:00-16:00", weekday: "6ªf", teacher: "PFS" },
];

export const ucs = [
    {
        acronym: "COMP",
        name: "Compiladores",
        weekday: "Sexta",
        time: "11:30-12:30",
        room: "B112",
        teacher: "TDRC",
        class: "3MIEIC01",
    },
    {
        acronym: "SDIS",
        name: "Sistemas Distribuídos",
        weekday: "Segunda",
        time: "14:30-16:30",
        room: "B301",
        teacher: "RGR",
        class: "3MIEIC04",
    },
    {
        acronym: "LBAW",
        name: "Laboratório de Bases de Dados e Aplicações Web",
        weekday: "Segunda",
        time: "09:00-12:00",
        room: "B314",
        teacher: "JCL",
        class: "3MIEIC01",
    },
    {
        acronym: "PPIN",
        name: "Proficiência Pessoal e Interpessoal",
        weekday: "Quinta",
        time: "10:30-12:30",
        room: "B107",
        teacher: "MFT",
        class: "3MIEIC05",
    },
    {
        acronym: "IART",
        name: "Inteligência Artificial",
        weekday: "Terça",
        time: "11:30-12:30",
        room: "B105",
        teacher: "HLC",
        class: "3MIEIC02",
    },
];
