export const convertToDate = (date, time) => {
    const dateParts = date.split('/');
    const dateTimeObject = new Date(dateParts[1] + "/" + dateParts[0] + "/" + dateParts[2]);
    const timeparts = time.split(':');
    dateTimeObject.setHours(parseInt(timeparts[0]), parseInt(timeparts[1]));
    return dateTimeObject;
}