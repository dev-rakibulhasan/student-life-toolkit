import useSubject from "./hooks/useSubject";

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
  "Friday",
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

// Question Types
export const questionTypes = [
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "true_false", label: "True/False" },
  { value: "short_answer", label: "Short Answer" },
];

// Prepare charts data
export const prepareStudyTimeChartData = (
  sessions,
  timeFilter = "thisWeek"
) => {
  if (!sessions || sessions.length === 0) {
    return { chartData: [], subjects: [] };
  }

  // Get date range based on time filter
  const dateRange = getDateRange(timeFilter, sessions);
  const allDates = getDatesInRange(dateRange.start, dateRange.end);

  // Get all unique subjects from sessions
  const allSubjects = [
    ...new Set(sessions.map((session) => session.subject)),
  ].sort();

  // Initialize chart data structure
  const chartData = allDates.map((date) => {
    const dateStr = formatChartDate(date, timeFilter);
    const dataPoint = { date: dateStr };

    // Initialize all subjects to 0 for this date
    allSubjects.forEach((subject) => {
      dataPoint[subject] = 0;
    });

    return dataPoint;
  });

  // Aggregate study time by date and subject
  sessions.forEach((session) => {
    const sessionDate = new Date(session.date);
    const dateStr = formatChartDate(sessionDate, timeFilter);

    // Find the corresponding data point
    const dataPoint = chartData.find((point) => point.date === dateStr);

    if (dataPoint) {
      // Add study time to the appropriate subject
      if (dataPoint.hasOwnProperty(session.subject)) {
        dataPoint[session.subject] += session.duration / 60;
      } else {
        dataPoint[session.subject] = session.duration / 60;
      }
    }
  });
  return {
    chartData,
    subjects: allSubjects,
  };
};

// Gets date range based on time filter
const getDateRange = (timeFilter, sessions) => {
  const now = new Date();
  let startDate, endDate;

  switch (timeFilter) {
    case "today":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );
      break;

    case "yesterday":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 1,
        23,
        59,
        59
      );
      break;

    case "thisWeek":
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - diffToMonday
      );
      endDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (6 - diffToMonday),
        23,
        59,
        59
      );
      break;

    case "thisMonth":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      break;

    case "thisYear":
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      break;

    case "lifetime":
    default:
      // For lifetime, find the earliest and latest dates from sessions
      if (sessions && sessions.length > 0) {
        const sessionDates = sessions.map((s) => new Date(s.date));
        startDate = new Date(Math.min(...sessionDates));
        endDate = new Date(Math.max(...sessionDates));
      } else {
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
        endDate = now;
      }
      break;
  }

  return { start: startDate, end: endDate };
};

const getDatesInRange = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

// Formats date for chart display based on time filter
const formatChartDate = (date, timeFilter) => {
  switch (timeFilter) {
    case "today":
    case "yesterday":
    case "thisWeek":
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

    case "thisMonth":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

    case "thisYear":
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

    case "lifetime":
    default:
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
  }
};

export const getSubjectColor = (subject) => {
  const { subjects } = useSubject();

  const subjectColors = subjects.reduce((acc, subj) => {
    acc[subj.name] = subj.color;
    return acc;
  }, {});

  // If subject has a predefined color, use it
  if (subjectColors[subject]) {
    return subjectColors[subject];
  }

  // Generate a consistent color for unknown subjects using a hash function
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
};
