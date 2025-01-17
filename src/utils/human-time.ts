const levelModifiers: number[] = [
    1000 * 60 * 60 * 24 * 365,  // years
    1000 * 60 * 60 * 24 * 30,   // months
    1000 * 60 * 60 * 24,        // days
    1000 * 60 * 60,             // hours
    1000 * 60,                  // minutes
    1000                        // seconds
];

const levelEnUnits: [string, string][] = [
    ['year', 'years'],
    ['month', 'months'],
    ['day', 'days'],
    ['hour', 'hours'],
    ['minute', 'minutes'],
    ['second', 'seconds']
];

const levelPtUnits: [string, string][] = [
    ['ano', 'anos'],
    ['mês', 'meses'],
    ['dia', 'dias'],
    ['hora', 'horas'],
    ['minuto', 'minutos'],
    ['segundo', 'segundos']
];

const toHumanReadableTimeDiff = (time: number, pivot: number = Date.now(), lang = 'pt'): string => {
    const timeDiff = Math.abs(time - pivot);
    const isPast = time < pivot;
    const levelUnits = lang === 'pt' ? levelPtUnits : levelEnUnits;
    const pastAdjective = lang === 'pt' ? 'atrás' : 'ago';
    const futureAdjective = lang === 'pt' ? 'em' : 'in';

    for (let i = 0; i < levelModifiers.length; i++) {
        const modifier = levelModifiers[i];
        const [unitSingular, unitPlural] = levelUnits[i];

        if (timeDiff >= modifier) {
            const value = Math.floor(timeDiff / modifier);
            const unit = value == 1 ? unitSingular : unitPlural;

            return isPast
                ? `${value} ${unit} ${pastAdjective}`
                : `${futureAdjective} ${value} ${unit}`;
        }
    }

    return 'just now';
}

export default toHumanReadableTimeDiff;
