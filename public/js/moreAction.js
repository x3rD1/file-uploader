document.querySelectorAll(".folder-card").forEach((card) => {
  const moreBtn = card.querySelector(".more-btn");
  const actionsPanel = card.querySelector(".folder-actions-panel");

  moreBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    // Close other panels
    document
      .querySelectorAll(".folder-actions-panel.active")
      .forEach((panel) => {
        if (panel !== actionsPanel) panel.classList.remove("active");
      });

    // Get button position and panel width
    const rect = moreBtn.getBoundingClientRect();
    const panelWidth = actionsPanel.offsetWidth;
    const viewportWidth = window.innerWidth;

    // Only flip to right if it would overflow viewport
    if (rect.left + 120 + panelWidth > viewportWidth) {
      // Flip panel to the left side of the button
      actionsPanel.style.left = "auto";
      actionsPanel.style.right = "0";
    } else {
      // Keep default position
      actionsPanel.style.left = "120px";
      actionsPanel.style.right = "auto";
    }

    // Toggle visibility
    actionsPanel.classList.toggle("active");
  });
});

// Close panels when clicking outside
document.addEventListener("click", () => {
  document.querySelectorAll(".folder-actions-panel.active").forEach((panel) => {
    panel.classList.remove("active");
  });
});
