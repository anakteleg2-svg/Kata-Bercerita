const editor = document.getElementById("editor");
const KEY = "kata-bercerita-note";

// Load
editor.innerHTML = localStorage.getItem(KEY) || "";

// Autosave
let timer;
editor.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    localStorage.setItem(KEY, editor.innerHTML);
  }, 300);
});