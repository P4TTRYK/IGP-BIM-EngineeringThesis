// https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation
export const fileSizeFormat = (size) => {
    if (size < 1e3) {
        return size + ' B';
    } else if (size < 1e6) {
        return (size / 1e3).toFixed(2) + ' kB';
    } else if (size < 1e9) {
        return (size / 1e6).toFixed(2) + ' MB';
    } else {
        return (size / 1e12).toFixed(2) + ' GB';
    }
}
