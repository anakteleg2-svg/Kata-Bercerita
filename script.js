const editor = document.getElementById("editor");
const toolbar = document.querySelector(".toolbar");

/* ===== AUTO SAVE ===== */
editor.innerHTML = localStorage.getItem("note") || "";

editor.addEventListener("input", () => {
  localStorage.setItem("note", editor.innerHTML);
});

/* ===== SERVICE WORKER REGISTER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
