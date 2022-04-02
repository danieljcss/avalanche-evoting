export function formatDate(time) {
    // @params time: integer representing seconds from 01-01-1970
    // @returns string: formatted date in local format with hours and minutes
    const date = new Date(time).toLocaleString('sv', { timeZoneName: 'short' })
    const dateArray = date.split(":")
    return dateArray[0] + ":" + dateArray[1] + dateArray[2].slice(2)

}