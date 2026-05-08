const hours = [
  { day: 1, open: "13:00", close: "23:00" },
  { day: 2, open: "12:00", close: "23:00" },
  { day: 3, open: "12:00", close: "23:00" },
  { day: 4, open: "12:00", close: "23:00" },
  { day: 5, open: "12:00", close: "23:00" },
  { day: 6, open: "12:00", close: "01:00" },
  { day: 0, open: "12:00", close: "00:00" },
];

const toMinutes = (value) => {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
};

const getSchedule = (day) => hours.find((entry) => entry.day === day);

const getOpenWindow = (schedule, offsetDays = 0) => {
  const open = toMinutes(schedule.open) + offsetDays * 24 * 60;
  let close = toMinutes(schedule.close) + offsetDays * 24 * 60;
  if (close <= open) close += 24 * 60;
  return { open, close, schedule };
};

const isOpenNow = () => {
  const now = new Date();
  const today = now.getDay();
  const yesterday = (today + 6) % 7;
  const current = now.getHours() * 60 + now.getMinutes();
  const todayWindow = getOpenWindow(getSchedule(today));
  const yesterdayWindow = getOpenWindow(getSchedule(yesterday), -1);
  const activeWindow =
    current >= yesterdayWindow.open && current < yesterdayWindow.close
      ? yesterdayWindow
      : todayWindow;

  return current >= activeWindow.open && current < activeWindow.close
    ? `Åpent nå til ${activeWindow.schedule.close}`
    : `Åpner ${todayWindow.schedule.open} i dag`;
};

document.querySelector("#open-status").textContent = isOpenNow();

const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".menu-card");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;

    tabs.forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");

    cards.forEach((card) => {
      const shouldShow = filter === "alle" || card.dataset.category === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});
