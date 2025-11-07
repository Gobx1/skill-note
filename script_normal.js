window.addEventListener("DOMContentLoaded", () => {
  // 🎂 Replace with your actual birth date (YYYY, M-1, D)
  const birthDate = new Date(2004, 10, 31); // example: June 12, 2004

  const now = new Date();
  const diffMs = now - birthDate;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)); // convert ms → hours

  const timePlayedElem = document.getElementById("time-played");
  if (timePlayedElem) {
    timePlayedElem.textContent = `🕓 Time Played(age): ${hours.toLocaleString()} hours`;
  }
});