const BlackbaseTimeSeconds = (min) => {
    return min * 60 * 1000
}

const BlackbaseTimeMinutes = (min) => {
    return min * 60 * 1000
}

const BlackbaseTimeHours = (hrs) => {
    return hrs * 60 * 60 * 1000
}

const BlackbaseTimeDays = (days) => {
    return days * 24 * 60 * 60 * 1000
}

module.exports = {BlackbaseTimeSeconds, BlackbaseTimeMinutes, BlackbaseTimeHours, BlackbaseTimeDays};