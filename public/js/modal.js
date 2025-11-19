const modal = document.getElementById("folderModal");
const openModalBtn = document.querySelector(".new-folder-btn");
const cancelModalBtn = document.getElementById("cancelModal");
const fileInput = document.querySelector(".file-upload input");

openModalBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  modal.classList.add("active");
  newPanel.classList.remove("active");
});

cancelModalBtn.addEventListener("click", () =>
  modal.classList.remove("active")
);

let isMouseDownOutside = false;

modal.addEventListener("mousedown", (e) => {
  // Check if mouse down started outside modal content
  isMouseDownOutside = e.target === modal;
});

modal.addEventListener("mouseup", (e) => {
  // Close only if mouse was pressed AND released outside content
  if (isMouseDownOutside && e.target === modal) {
    modal.classList.remove("active");
  }
});

// ===== FILE INPUT =====
fileInput.addEventListener("click", () => newPanel.classList.remove("active"));

// FOLDER RENAME
const renameFolderModal = document.getElementById("renameFolderModal");
const cancelRenameFolderBtn = document.getElementById("cancelRenameFolder");
const renameFolderForm = document.getElementById("renameFolderForm");

// Attach event listeners to all folder rename buttons
document.querySelectorAll(".folder-actions-panel .rename").forEach((btn) => {
  btn.addEventListener("click", () => {
    const folderId = btn.dataset.folderId;
    const currentName = btn.dataset.folderName;

    // Set form action dynamically
    renameFolderForm.action = `/upload/folders/rename/${folderId}`;

    // Pre-fill input with current folder name
    renameFolderForm.newName.value = currentName;

    // Show modal
    renameFolderModal.classList.add("active");
  });
});

// Close modal with Cancel button
cancelRenameFolderBtn.addEventListener("click", () => {
  renameFolderModal.classList.remove("active");
});

// Close modal when clicking outside content

renameFolderModal.addEventListener("mousedown", (e) => {
  // Check if mouse down started outside modal content
  isMouseDownOutside = e.target === renameFolderModal;
});

renameFolderModal.addEventListener("mouseup", (e) => {
  // Close only if mouse was pressed AND released outside content
  if (isMouseDownOutside && e.target === renameFolderModal) {
    renameFolderModal.classList.remove("active");
  }
});
