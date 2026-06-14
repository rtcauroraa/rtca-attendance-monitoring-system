
export const formatDateToMilitary = (dateInput?: Date | string | null): string => {
  if(!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) return ""; 

  const day = date.getDate().toString().padStart(2, "0");

  // Short month names in uppercase
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthNames[date.getMonth()];

  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};