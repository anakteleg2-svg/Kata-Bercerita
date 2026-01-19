const editor = document.getElementById("editor");
const toolbar = document.querySelector(".toolbar");

/* ===== AUTO SAVE ===== */
editor.innerHTML = localStorage.getItem("note") || "";

editor.addEventListener("input", () => {
  localStorage.setItem("note", editor.innerHTML);
});

/* ===== TOOLBAR AUTO HIDE ===== */
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const current = window.scrollY;

  if (current > lastScroll && current > 50) {
    toolbar.style.transform = "translateY(-100%)";
  } else {
    toolbar.style.transform = "translateY(0)";
  }

  lastScroll = current;
});

/* ===== SERVICE WORKER REGISTER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
