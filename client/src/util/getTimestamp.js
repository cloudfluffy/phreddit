export default function getTimestamp(date) {
    if (!date) {
        return;
    }

    date = new Date(date);

    const millisecondDifference = Date.now() - date.getTime();
    let value;

    if ((value = millisecondToYear(millisecondDifference)) > 0) {
        return `${value} year(s) ago`;
    }

    if ((value = millisecondToMonth(millisecondDifference)) > 0) {
        return `${value} month(s) ago`;
    }

    if ((value = millisecondToDay(millisecondDifference)) > 0) {
        return `${value} day(s) ago`;
    }

    if ((value = millisecondToHour(millisecondDifference)) > 0) {
        return `${value} hour(s) ago`;
    }

    if ((value = millisecondToMinute(millisecondDifference)) > 0) {
        return `${value} minute(s) ago`;
    }

    if ((value = millisecondToSecond(millisecondDifference)) >= 0) {
        return `${value} second(s) ago`;
    }

    throw new Error('Invalid timestamp: The given date is in the future or the calculation failed at getTimestamp.');
}

function millisecondToSecond(millisecond) {
    // second = 1000 * millisecond
    return Math.floor(millisecond / 1000);
}

function millisecondToMinute(millisecond) {
    // minute = 60 * 1000 * millisecond
    return Math.floor(millisecond / 60000);
}

function millisecondToHour(millisecond) {
    // hour = 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 3600000);
}

function millisecondToDay(millisecond) {
    // day = 24 * 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 86400000);
}

function millisecondToMonth(millisecond) {
    // month = 30 * 24 * 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 2592000000);
}

function millisecondToYear(millisecond) {
    // year = 12 * 30 * 24 * 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 31104000000);
}
