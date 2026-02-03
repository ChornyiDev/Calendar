import "./style.css";
import { scheduleConfig } from "./schedule.js";

// DOM Elements
const userTimezoneEl = document.getElementById("user-timezone");
const currentMonthYearEl = document.getElementById("current-month-year");
const calendarGridEl = document.getElementById("calendar-grid");
const startDayToggle = document.getElementById("start-day-toggle");
const prevBtn = document.getElementById("prev-month");
const nextBtn = document.getElementById("next-month");
const slotDetailsEl = document.getElementById("slot-details");

// State
let currentDate = new Date();
let userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Changed to let
let weekStartDay = 0; // 0=Sun, 1=Mon

// Initialize
// Initialize
function init() {
  populateTimezoneSelector();
  updateTimezoneDisplay();

  // 1. Try to load preference
  const savedStartDay = localStorage.getItem("calendarStartDay");
  if (savedStartDay) {
    weekStartDay =
      savedStartDay === "auto" ? detectStartDay() : parseInt(savedStartDay);
    startDayToggle.value = savedStartDay;
  } else {
    // 2. Default Auto
    weekStartDay = detectStartDay();
    startDayToggle.value = "auto"; // Default UI state
  }

  renderCalendar();
  updateLegend();

  prevBtn.addEventListener("click", () => changeMonth(-1));
  nextBtn.addEventListener("click", () => changeMonth(1));

  startDayToggle.addEventListener("change", (e) => {
    const val = e.target.value;
    localStorage.setItem("calendarStartDay", val); // Save preference

    if (val === "auto") {
      weekStartDay = detectStartDay();
    } else {
      weekStartDay = parseInt(val);
    }
    renderCalendar();
  });

  const tzSelect = document.getElementById("timezone-select");
  tzSelect.addEventListener("change", (e) => {
    userTimezone = e.target.value;
    updateTimezoneDisplay();
    renderCalendar();
    updateLegend();
    // Hide details as they might be stale
    slotDetailsEl.classList.add("hidden");
  });

  // Initialize button states
  updateNavButtons(0);
}

function populateTimezoneSelector() {
  const select = document.getElementById("timezone-select");
  const timezones = Intl.supportedValuesOf("timeZone");

  // Sort timezones, maybe prioritize common ones or user's current one
  timezones.forEach((tz) => {
    const option = document.createElement("option");
    option.value = tz;
    option.textContent = tz.replace(/_/g, " ");
    if (tz === userTimezone) option.selected = true;
    select.appendChild(option);
  });
}

function updateTimezoneDisplay() {
  const availabilityEl = document.getElementById("availability-display");
  if (availabilityEl && scheduleConfig.availabilityRange) {
    const { start, end } = scheduleConfig.availabilityRange;
    // We use a dummy date (Today) to calculate the offset
    const todayStr = new Date().toISOString().split("T")[0];
    const converted = convertTime(todayStr, start, end);

    availabilityEl.innerHTML = `Available: <span class="availability-range">${converted.start} - ${converted.end}</span> <span class="timezone-abbr">(${userTimezone.split("/").pop().replace("_", " ")})</span>`;
  }
}

function updateLegend() {
  const legendHoursEl = document.getElementById("legend-working-hours");
  // Get Monday hours as representative
  const mondaySlots = scheduleConfig.weekly[1];
  if (mondaySlots && mondaySlots.length > 0) {
    // Convert first slot to show example
    // We need a dummy date to convert "generic" weekly hours.
    // Use Today? Or fixed date? Using Today to be accurate to DST of *now*.
    const todayStr = new Date().toISOString().split("T")[0];
    const [start, end] = mondaySlots[0].split("-");
    const converted = convertTime(todayStr, start, end);
    legendHoursEl.textContent = `(${converted.start} - ${converted.end})`;
  } else {
    legendHoursEl.textContent = "";
  }
}

// Limit navigation to 2 months back and 2 months forward relative to TODAY
function changeMonth(delta) {
  const newDate = new Date(currentDate);
  newDate.setMonth(newDate.getMonth() + delta);

  const today = new Date();
  // Normalize comparison to 1st of month to avoid issues with day overflow
  const compareDate = new Date(newDate.getFullYear(), newDate.getMonth(), 1);
  const compareToday = new Date(today.getFullYear(), today.getMonth(), 1);

  // Calculate difference in months
  const monthDiff =
    (compareDate.getFullYear() - compareToday.getFullYear()) * 12 +
    (compareDate.getMonth() - compareToday.getMonth());

  // Allow: 0 (current), ..., +2 (2 months future). No past months.
  if (monthDiff >= 0 && monthDiff <= 2) {
    currentDate = newDate;
    renderCalendar();
    slotDetailsEl.classList.add("hidden");
    updateNavButtons(monthDiff); // Optional: Disable buttons visually
  }
}

function updateNavButtons(diff) {
  // Update button states if at edge
  // Disable prev button if we are at current month (diff 0) or earlier
  prevBtn.style.opacity = diff <= 0 ? "0.3" : "1";
  prevBtn.style.pointerEvents = diff <= 0 ? "none" : "auto";

  nextBtn.style.opacity = diff >= 2 ? "0.3" : "1";
  nextBtn.style.pointerEvents = diff >= 2 ? "none" : "auto";
}

// Helper to create a Date object representing a specific time in a specific timezone
function createDateInZone(dateStr, timeStr, zone) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);

  // Start with a UTC assumption
  let date = new Date(Date.UTC(y, m - 1, d, h, min));

  // Refine it by checking the mismatch
  // We do 2 iterations which is usually enough to converge on the offset
  for (let i = 0; i < 3; i++) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    }).formatToParts(date);

    const part = (type) => parseInt(parts.find((p) => p.type === type).value);

    // Construct the "Time it thinks it is"
    // Note: Month is 1-based in parts, 0-based in Date
    const currentZoneTimeMs = Date.UTC(
      part("year"),
      part("month") - 1,
      part("day"),
      part("hour"),
      part("minute"),
    );
    const targetTimeMs = Date.UTC(y, m - 1, d, h, min);

    const diff = targetTimeMs - currentZoneTimeMs;

    if (diff === 0) break;

    date = new Date(date.getTime() + diff);
  }

  return date;
}

function convertTime(dateStr, start, end) {
  const startDate = createDateInZone(dateStr, start, scheduleConfig.timezone);
  const endDate = createDateInZone(dateStr, end, scheduleConfig.timezone);

  const options = { hour: "2-digit", minute: "2-digit", hour12: false };
  const s = new Intl.DateTimeFormat("en-GB", options).format(startDate); // Format in *userTimezone*? No, 'en-GB' uses local system zone by default unless timeZone opt provided.
  // FIX: We must pass userTimezone to format!

  const formatInUserTz = (d) =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: userTimezone,
    }).format(d);

  // Check if date changed (e.g. overnight for user)
  // We compare the date string of the result vs the selected date
  const userDateStr = new Intl.DateTimeFormat("en-CA", {
    // YYYY-MM-DD
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: userTimezone,
  }).format(startDate);

  let diffDate = "";
  // Simple string comparison YYYY-MM-DD works
  if (userDateStr !== dateStr) {
    if (userDateStr > dateStr) diffDate = "+1 day";
    else diffDate = "-1 day";
  }

  return {
    start: formatInUserTz(startDate),
    end: formatInUserTz(endDate),
    diffDate,
  };
}

function detectStartDay() {
  // 1. Try Intl.Locale first
  const weekInfo = new Intl.Locale(navigator.language).weekInfo;

  // Default from Locale
  let day = 0; // Default Sun
  if (weekInfo) {
    day = weekInfo.firstDay === 7 ? 0 : weekInfo.firstDay;
  }

  // 2. Heuristic Override
  // Many users in Europe have en-US (Sunday) locale but expect Monday.
  // If Locale says Sunday (0), but Timezone is Europe, force Monday (1).
  if (day === 0) {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && tz.startsWith("Europe/")) {
      return 1;
    }
  }

  return day;
}

// Fixed renderCalendar to attach listener correctly
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);
  currentMonthYearEl.textContent = monthName;

  // Update Grid Header
  const gridHeader = document.querySelector(".calendar-grid-header");
  if (gridHeader) {
    gridHeader.innerHTML = "";
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    // Rotate array based on start day
    // If 0 (Sun), no rotation. If 1 (Mon), rotate 1.
    for (let i = 0; i < 7; i++) {
      const dIndex = (i + weekStartDay) % 7;
      const div = document.createElement("div");
      div.textContent = days[dIndex];
      gridHeader.appendChild(div);
    }
  }

  calendarGridEl.innerHTML = "";

  const firstDay = new Date(year, month, 1);
  const dayOfWeek = firstDay.getDay();

  // Calculate empty slots
  // Grid slots: 0, 1, 2...
  // We want logic: (ActualDay - StartDay + 7) % 7
  let emptySlots = (dayOfWeek - weekStartDay + 7) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < emptySlots; i++) {
    const empty = document.createElement("div");
    empty.className = "day-cell empty";
    calendarGridEl.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dateObj = new Date(year, month, day);
    const dow = dateObj.getDay();

    const cell = document.createElement("div");
    cell.className = "day-cell";
    cell.textContent = day;

    const status = getDayStatus(dateStr, dow);
    cell.classList.add(`status-${status.type}`);

    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    // Capture variables in closure
    cell.addEventListener("click", () => selectDate(cell, dateStr, status));
    calendarGridEl.appendChild(cell);
  }
}

function getDayStatus(dateStr, dayOfWeek) {
  // Check overrides first
  if (scheduleConfig.overrides.hasOwnProperty(dateStr)) {
    const override = scheduleConfig.overrides[dateStr];
    // If override is null, it's a special day off (holiday)
    if (override === null) return { type: "off-special", slots: [] };
    return { type: "modified", slots: override };
  }

  // Check weekly schedule
  const standard = scheduleConfig.weekly[dayOfWeek];
  if (!standard || standard.length === 0) {
    // Standard non-working day (weekend)
    return { type: "off", slots: [] };
  }

  return { type: "working", slots: standard };
}

function selectDate(cell, dateStr, status) {
  document
    .querySelectorAll(".day-cell.selected")
    .forEach((el) => el.classList.remove("selected"));
  cell.classList.add("selected");

  const dateObj = new Date(dateStr);
  const prettyDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(dateObj);

  let html = `<div class="slot-title">${prettyDate}</div>`;

  if (status.type === "off" || status.type === "off-special") {
    const label =
      status.type === "off-special" ? "Holiday / Day Off" : "Day Off";
    html += `<div class="slot-time">${label} <span style="font-size:0.8em; margin-left:8px">😴</span></div>`;
  } else {
    // Clean up timezone string for display (e.g., "Europe/Kyiv" -> "Europe Kyiv")
    const tzDisplay = userTimezone.replace("_", " ");
    html += `<div class="slot-title">Available times (in ${tzDisplay}):</div>`;

    status.slots.forEach((slot) => {
      const [start, end] = slot.split("-");
      // FIX: Ensure 'convertTime' uses the updated 'userTimezone' variable, which it does via closure/global scope
      const converted = convertTime(dateStr, start, end);
      html += `
        <div class="slot-time">
          ${converted.start} - ${converted.end}
        </div>
        ${converted.diffDate ? `<div class="note">(${converted.diffDate})</div>` : ""}
      `;
    });
  }

  slotDetailsEl.innerHTML = html;
  slotDetailsEl.classList.remove("hidden");
}

// Expose init globally just in case, but module executes it.
init();
