const newBtn = document.querySelector(".new-btn");
const newPanel = document.querySelector(".new-panel");

newBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  newPanel.classList.toggle("active");
});

document.addEventListener("click", (e) => {
  if (!newPanel.contains(e.target) && !newBtn.contains(e.target)) {
    newPanel.classList.remove("active");
  }
});
