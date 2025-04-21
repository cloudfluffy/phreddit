export default function get_timestamp(date) {
    date = new Date(date);

    const millisecond_difference = Date.now() - date.getTime();
    let value;

    if ((value = millisecond_to_year(millisecond_difference)) > 0) {
        return `${value} year(s) ago`;
    }

    if ((value = millisecond_to_month(millisecond_difference)) > 0) {
        return `${value} month(s) ago`;
    }

    if ((value = millisecond_to_day(millisecond_difference)) > 0) {
        return `${value} day(s) ago`;
    }

    if ((value = millisecond_to_hour(millisecond_difference)) > 0) {
        return `${value} hour(s) ago`;
    }

    if ((value = millisecond_to_minute(millisecond_difference)) > 0) {
        return `${value} minute(s) ago`;
    }

    if ((value = millisecond_to_second(millisecond_difference)) >= 0) {
        return `${value} second(s) ago`;
    }

    throw new Error('Invalid timestamp: The given date is in the future or the calculation failed at get_timestamp.');
}

function millisecond_to_second(millisecond) {
    // second = 1000 * millisecond
    return Math.floor(millisecond / 1000);
}

function millisecond_to_minute(millisecond) {
    // minute = 60 * 1000 * millisecond
    return Math.floor(millisecond / 60000);
}

function millisecond_to_hour(millisecond) {
    // hour = 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 3600000);
}

function millisecond_to_day(millisecond) {
    // day = 24 * 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 86400000);
}

function millisecond_to_month(millisecond) {
    // month = 30 * 24 * 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 2592000000);
}

function millisecond_to_year(millisecond) {
    // year = 12 * 30 * 24 * 60 * 60 * 1000 * millisecond
    return Math.floor(millisecond / 31104000000);
}
