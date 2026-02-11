const toggleButton=document.getElementById("themeToggle");
const themeFile=document.getElementById("themeStylesheet");

let currentTheme = localStorage.getItem("theme") || "light";
themeFile.href = `/${currentTheme}.css`;

// Toggle button click
toggleBtn.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  themeFile.href = `/${currentTheme}.css`;
  localStorage.setItem("theme", currentTheme);

  toggleBtn.textContent = 
    currentTheme === "light" ? "🌙 Dark Mode" : "☀ Light Mode";
});