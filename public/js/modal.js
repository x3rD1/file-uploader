const modal = document.getElementById("folderModal");
const openModalBtn = document.querySelector(".new-folder-btn");
const cancelModalBtn = document.getElementById("cancelModal");

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
