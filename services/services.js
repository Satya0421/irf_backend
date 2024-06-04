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
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  const timeString = "00:00:00";
  const currentDate = convertDateTime(formattedDate, timeString);
  return currentDate;
}
export { convertDateTime, isDate, getCurrentDate };
