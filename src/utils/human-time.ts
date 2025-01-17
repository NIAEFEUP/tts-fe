const timeLevels: [number, string][] = [
    [1000 * 60 * 60 * 24 * 365, 'years'],
    [1000 * 60 * 60 * 24 * 30, 'months'],
    [1000 * 60 * 60 * 24, 'days'],
    [1000 * 60 * 60, 'hours'],
    [1000 * 60, 'minutes'],
    [1000, 'seconds'],
];

const toHumanReadableTimeDiff = (time: number, pivot: number = Date.now(), lang = 'pt'): string => {
    const timeDiff = Math.abs(time - pivot);
    console.log('DB:', pivot, time);
    const isPast = time < pivot;

    for (const [modifier, unit] of timeLevels) {
        if (timeDiff >= modifier) {
            const value = Math.floor(timeDiff / modifier);
            return isPast
                ? `${value} ${unit} ago`
                : `in ${value} ${unit}`;
        }
    }

    return 'just now';
}

export default toHumanReadableTimeDiff;
