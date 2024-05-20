function convertDateTime(dateString, timeString) {
  const combinedString = `${dateString}T${timeString}`;
  const date = new Date(combinedString);
  return date.toISOString();
}

function isDate(str) {
  var datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(str);
}
export { convertDateTime, isDate };
