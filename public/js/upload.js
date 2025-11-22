const fileInput = document.querySelector(".file-upload");

// ===== FILE INPUT =====
fileInput.addEventListener("click", (e) => {
  if (e.target.tagName !== "INPUT") {
    fileInput.querySelector("input[type=file]").click();
  }
  newPanel.classList.remove("active");
});
