const dateProperties = (isoString: string) => {
    const date = new Date(isoString);

    const time = date.toLocaleTimeString('pt-PT'); // HH:mm
    const day = date.getDate().toString().padStart(2, '0'); // DD
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // MM
    const year = date.getFullYear(); // YYYY

    return { time, day, month, year };
}

const requestCreatedAtDate = (isoString: string) => {
    const { time, day, month, year } = dateProperties(isoString);

    return `Criado às ${time} de ${day}/${month}/${year}`;
}