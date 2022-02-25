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

export const names = [
    "Oliver Hansen",
    "Van Henry",
    "April Tucker",
    "Ralph Hubbard",
    "Omar Alexander",
    "Carlos Abbott",
    "Miriam Wagner",
    "Bradley Wilkerson",
    "Virginia Andrews",
    "Kelly Snyder",
];

export const ucs = [
    { acronym: "LBAW", name: "Laboratório de Bases de Dados e Aplicações Web", open: false },
    { acronym: "SDIS", name: "Sistemas Distribuídos", open: false },
    { acronym: "COMP", name: "Compiladores", open: false },
    { acronym: "IART", name: "Inteligência Artificial", open: false },
    { acronym: "PPIN", name: "Proficiência Pessoal e Interpessoal", open: false },
];
