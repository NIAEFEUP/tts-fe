export const courses = [
    { label: "Mestrado em Planeamento e Projecto Urbano" },
    { label: "Programa de Doutoramento em Arquitetura" },
    { label: "Programa Doutoral em Segurança e Saúde Ocupacionais" },
    { label: "Licenciatura em Engenharia Informática e Computação" },
    { label: "Licenciatura em Engenharia Eletrotécnica e de Computadores" },
    { label: "Licenciatura em Engenharia Mecânica" },
    { label: "Mestrado em Engenharia Informática e Computação" },
];

export const semesterUCs = [
    { year: 1, semester: 1, ucs: ["AC", "DS", "PRI", "SDLE", "SGI"] },
    {
        year: 1,
        semester: 2,
        ucs: [
            "LGP",
            "ASMA",
            "ASSO",
            "BDNR",
            "CAC",
            "CPM",
            "CPA",
            "DDJD",
            "ER",
            "EDAA",
            "GEE",
            "GRS",
            "GSSI",
            "MK",
            "MFS",
            "O",
            "PLN",
            "PLR",
            "SR",
            "SSI",
            "SAM",
            "SETR",
            "TBD",
            "VC",
        ],
    },
    {
        year: 2,
        semester: 1,
        ucs: [
            "API",
            "AID",
            "CAC",
            "CHE",
            "CPA",
            "ELS",
            "ESS",
            "GSAI",
            "MS",
            "MNEC",
            "RVA",
            "RI",
            "S",
            "SCI",
            "TACS",
            "TVVS",
            "TAIM",
            "WSDL",
        ],
    },
    {
        year: 2,
        semester: 2,
        ucs: ["D"],
    },
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

const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export const getDisplayDate = () => {
    const date = new Date();
    return `${dayNames[date.getDay()]}, ${date.getDate() + 1} ${monthNames[date.getMonth()]}`;
};

export const getSemester = () => {
    //jan-jul --> 2º Semestre
    const date = new Date();
    const month = date.getMonth();

    return month >= 0 && month <= 6 ? "2ºS" : "1ºS";
};

export const getSchoolYear = () => {
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    return month >= 0 && month <= 6
        ? `${year - 1}/${year.toString().slice(2, 4)}`
        : `${year}/${(year + 1).toString().slice(2, 4)}`;
};
