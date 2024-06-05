function convertDateTime(dateString, timeString) {
  const combinedString = `${dateString}T${timeString}`;
  const date = new Date(combinedString);
  return date.toISOString();
}

function isDate(str) {
  var datePattern = /^\d{4}-\d{2}-\d{2}$/;
  return datePattern.test(str);
}

function getCurrentDate() {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}
export { convertDateTime, isDate, getCurrentDate };
