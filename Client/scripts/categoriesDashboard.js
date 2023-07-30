const deleteButton = document.querySelector(".delete-button");
const confirmDeleteModal = document.querySelector(".modal");
const closeModalButton = document.querySelector(".modal .close-modal");

deleteButton.addEventListener("click", () => {
    confirmDeleteModal.classList.remove("hide");
});

closeModalButton.addEventListener("click", () => {
    confirmDeleteModal.classList.add("hide");
});