const editor = document.getElementById("editor");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const noteList = document.getElementById("noteList");
const newNoteBtn = document.getElementById("newNote");
const noteMenu = document.getElementById("noteMenu");
const renameBtn = document.getElementById("renameNote");
const deleteBtn = document.getElementById("deleteNote");

let notes = JSON.parse(localStorage.getItem("notes")) || [];
let currentNote = null;

/* ===== RENDER SIDEBAR ===== */
function renderNotes() {
  noteList.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note.content.slice(0,30) || "Catatan kosong";

    let pressTimer;
    li.addEventListener("click", () => openNote(note.id));

    li.addEventListener("touchstart", () => {
      pressTimer = setTimeout(() => {
        currentNote = note;
        noteMenu.classList.remove("hidden");
      }, 600);
    });

    li.addEventListener("touchend", () => clearTimeout(pressTimer));

    noteList.appendChild(li);
  });
}

/* ===== OPEN NOTE ===== */
function openNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;

  currentNote = note;
  editor.innerHTML = note.content;
  sidebar.classList.remove("show");
  overlay.classList.add("hidden");
}

/* ===== NEW NOTE ===== */
newNoteBtn.onclick = () => {
  const note = { id: Date.now(), content: "" };
  notes.unshift(note);
  currentNote = note;
  editor.innerHTML = "";
  saveNotes();
  renderNotes();
  sidebar.classList.remove("show");
  overlay.classList.add("hidden");
};

/* ===== AUTO SAVE ===== */
editor.addEventListener("input", () => {
  if (!currentNote) return;
  currentNote.content = editor.innerHTML;
  saveNotes();
  renderNotes();
});

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

/* ===== INIT ===== */
if (notes.length === 0) newNoteBtn.click();
else openNote(notes[0].id); 
renderNotes();

/* ===== SWIPE GESTURE ===== */
let startX = 0;
document.addEventListener("touchstart", e => startX = e.touches[0].clientX);
document.addEventListener("touchend", e => {
  const endX = e.changedTouches[0].clientX;
  if (endX - startX > 80) {
    sidebar.classList.add("show");
    overlay.classList.remove("hidden");
  }
  if (startX - endX > 80) {
    sidebar.classList.remove("show");
    overlay.classList.add("hidden");
  }
});

/* ===== TAP OUTSIDE SIDEBAR ===== */
overlay.addEventListener("click", () => {
  sidebar.classList.remove("show");
  overlay.classList.add("hidden");
});

/* ===== NOTE MENU (RENAME / DELETE) ===== */
renameBtn.onclick = () => {
  if (!currentNote) return;
  const title = prompt("Judul catatan:", currentNote.content.split("<")[0]);
  if (title !== null) {
    currentNote.content = title;
    editor.innerHTML = title;
    saveNotes();
    renderNotes();
  }
  noteMenu.classList.add("hidden");
};

deleteBtn.onclick = () => {
  if (!currentNote) return;
  if (confirm("Hapus catatan ini?")) {
    notes = notes.filter(n => n.id !== currentNote.id);
    saveNotes();
    if (notes.length > 0) openNote(notes[0].id);
    else newNoteBtn.click();
    renderNotes();
  }
  noteMenu.classList.add("hidden");
};

document.addEventListener("click", e => {
  if (!e.target.closest(".note-menu")) noteMenu.classList.add("hidden");
});

/* ===== FOCUS EDITOR ANYWHERE ===== */
editor.addEventListener("click", () => {
  editor.focus();
  const range = document.createRange();
  range.selectNodeContents(editor);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
});

/* ===== SERVICE WORKER ===== */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
