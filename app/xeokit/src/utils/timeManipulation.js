// convert sqlite GMT+0 date time string to local Date object
export function convertGMTToLocal(dateTimeStr) {
    if (!dateTimeStr) return null;
    return new Date(dateTimeStr + 'Z');
}

// get localized date time string
export function formatDateTime(date) {
    if (!date) return null;
    return date.toLocaleString('pl-PL');
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
function _getTimeNounForm(n, timePart) {
    const rtf = new Intl.RelativeTimeFormat('pl-PL', {numeric: "auto"});

    return rtf.format(n, timePart);
}

// get relative time string
export function textRelativeTime(date, now = new Date()) {
    if (!date) return null;
    const dateObj = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(dateObj.getTime())) return null;

    let diffSeconds = Math.floor((now - dateObj) / 1000);

    const direction = diffSeconds >= 0 ? -1 : 1;
    diffSeconds = Math.abs(diffSeconds);

    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffYears = Math.floor(diffDays / 365);
    const diffMonths = Math.floor(diffYears * 12 + (diffDays % 365) / 30);

    const units = [
        {value: diffYears, name: "year"},
        {value: diffMonths, name: "month"},
        {value: diffWeeks, name: "week"},
        {value: diffDays, name: "day"},
        {value: diffHours, name: "hour"},
        {value: diffMinutes, name: "minute"},
        {value: diffSeconds, name: "second"}
    ];

    const unit = units.find(u => u.value > 0) || units[units.length - 1];

    return _getTimeNounForm(direction * unit.value, unit.name);
}
