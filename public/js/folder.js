const renameFolderModal = document.getElementById("renameFolderModal");
const cancelRenameFolderBtn = document.getElementById("cancelRenameFolder");
const renameFolderForm = document.getElementById("renameFolderForm");

// Attach event listeners to all folder rename buttons
document.querySelectorAll(".folder-actions-panel .rename").forEach((btn) => {
  btn.addEventListener("click", () => {
    const folderId = btn.dataset.folderId;
    const currentName = btn.dataset.folderName;

    // Set form action dynamically
    renameFolderForm.action = `/folders/${folderId}/rename`;

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

document.querySelectorAll(".folder-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    // prevent navigation if clicking on dots or action buttons
    if (
      e.target.closest(".folder-actions-panel") ||
      e.target.closest(".more-btn")
    ) {
      return;
    }
    const folderId = card.dataset.folderId;
    window.location.href = `/folders/${folderId}`;
  });
});
