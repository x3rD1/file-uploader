document.querySelectorAll(".file-card").forEach((card) => {
  card.addEventListener("click", (e) => {
    // prevent navigation if clicking on dots or action buttons
    if (
      e.target.closest(".file-dots") ||
      e.target.closest(".file-actions-panel")
    ) {
      return;
    }
    const fileId = card.dataset.fileId;
    window.location.href = `/files/${fileId}`;
  });
});
