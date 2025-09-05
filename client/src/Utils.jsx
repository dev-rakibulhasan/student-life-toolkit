// Generate time slots from 8:00 AM to 8:00 PM
export const timeSlots = Array.from({ length: 49 }, (_, i) => {
  const totalMinutes = 8 * 60 + i * 15;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 20 && minutes > 0) {
    return null;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}).filter((time) => time !== null);

// Convert time to AM/PM format
export const formatTime = (timeStr) => {
  if (!timeStr) return "";
  let hours, minutes;
  if (typeof timeStr === "string") {
    [hours, minutes] = timeStr.split(":").map(Number);
  } else {
    return timeStr;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
};

export const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];
