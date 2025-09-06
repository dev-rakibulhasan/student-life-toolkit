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
// Days
export const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];
// Filter items by time period
export const filterBudgetByTimePeriod = (items, timeFilter) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Start of week (Monday)
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(today.getDate() - diffToMonday);

  // Start of month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of year
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  switch (timeFilter) {
    case "today":
      return items.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= today;
      });

    case "yesterday":
      return items.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= yesterday && itemDate < today;
      });

    case "thisWeek":
      return items.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfWeek;
      });

    case "thisMonth":
      return items.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfMonth;
      });

    case "thisYear":
      return items.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= startOfYear;
      });

    case "lifetime":
    default:
      return items;
  }
};
// Get time filter label
export const getTimeFilterLabel = (timeFilter) => {
  switch (timeFilter) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "thisWeek":
      return "This Week";
    case "thisMonth":
      return "This Month";
    case "thisYear":
      return "This Year";
    case "lifetime":
      return "Lifetime";
    default:
      return "Lifetime";
  }
};

// Subjects
export const subjects = [
  "Mathematics",
  "Science",
  "History",
  "English",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Geography",
  "Economics",
];
// Question Types
export const questionTypes = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True/False" },
  { value: "short_answer", label: "Short Answer" },
];
