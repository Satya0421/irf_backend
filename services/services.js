function convertDateTime(dateString, timeString) {
  const combinedString = `${dateString}T${timeString}`;
  const date = new Date(combinedString);
  return date.toISOString();
}
export { convertDateTime };
