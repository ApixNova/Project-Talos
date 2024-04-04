//returns current date in YYYY-MM-DD format taking into account the timezone
export function getCurrentDate() {
  const currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  const shiftedDate = new Date(currentDate.getTime() - offset * 60 * 1000);
  return shiftedDate.toISOString().split("T")[0];
}
