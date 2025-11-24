const renameFolderModal = document.getElementById("renameFolderModal");
const cancelRenameFolderBtn = document.getElementById("cancelRenameFolder");
const renameFolderForm = document.getElementById("renameFolderForm");
let isMouseDownOutsideRename = false;
let isMouseDownOutsideShare = false;
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
  isMouseDownOutsideRename = e.target === renameFolderModal;
});

renameFolderModal.addEventListener("mouseup", (e) => {
  // Close only if mouse was pressed AND released outside content
  if (isMouseDownOutsideRename && e.target === renameFolderModal) {
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

const shareFolderModal = document.getElementById("shareFolderModal");
const cancelShareFolderBtn = document.getElementById("cancelShareFolder");
const shareFolderForm = document.getElementById("shareFolderForm");
const shareLinkContainer = document.getElementById("shareLinkContainer");
const shareLinkInput = document.getElementById("shareLink");
const copyLinkBtn = document.getElementById("copyLink");

let currentFolderId = null;
shareFolderForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // prevent normal form submit

  const duration = shareFolderForm.duration.value;

  try {
    const res = await fetch(shareFolderForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ duration }),
    });

    if (!res.ok) throw new Error("Failed to generate link");

    const data = await res.json();
    // Assuming your server responds: { link: "https://..." }
    shareLinkInput.value = data.link;
    shareLinkContainer.style.display = "block";
  } catch (err) {
    console.error(err);
    alert("Could not generate link. Try again.");
  }
});
// Open modal when clicking share buttons
document.querySelectorAll(".folder-actions-panel .share").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const folderCard = e.target.closest(".folder-card");
    currentFolderId = folderCard.dataset.folderId;

    shareFolderForm.action = `/folders/${currentFolderId}/share`;
    shareLinkContainer.style.display = "none"; // hide previous link
    shareLinkInput.value = "";

    shareFolderModal.classList.add("active");
  });
});

// Close modal
cancelShareFolderBtn.addEventListener("click", () => {
  shareFolderModal.classList.remove("active");
});

// Optional: close modal if clicked outside content
shareFolderModal.addEventListener("mousedown", (e) => {
  isMouseDownOutsideShare = e.target === shareFolderModal;
});
shareFolderModal.addEventListener("mouseup", (e) => {
  if (isMouseDownOutsideShare && e.target === shareFolderModal) {
    shareFolderModal.classList.remove("active");
  }
});

// Copy link
copyLinkBtn.addEventListener("click", () => {
  shareLinkInput.select();
  document.execCommand("copy");
});

document
  .querySelectorAll('form[action*="/folders/"][action*="/delete"]')
  .forEach((form) => {
    form.addEventListener("submit", function (e) {
      if (!confirm("Delete this folder? This cannot be undone.")) {
        e.preventDefault();
      }
    });
  });
