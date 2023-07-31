const toggleButton = document.querySelector(".toggle-button");
const rightButtonsSM = document.querySelector(".right-buttons-sm");
const closeButton = document.querySelector(".right-buttons-sm .close");
const deleteButton = document.querySelector(".delete-button");
const confirmDeleteModal = document.querySelector(".modal")
const closeModalButton = document.querySelector(".modal .close-modal")

toggleButton.addEventListener("click", () => {
    rightButtonsSM.classList.remove('hide');
})

closeButton.addEventListener("click", () => {
    rightButtonsSM.classList.add("hide");
})

deleteButton.addEventListener("click", () => {
    confirmDeleteModal.classList.remove("hide")
})

closeModalButton.addEventListener("click", () => {
    confirmDeleteModal.classList.add('hide')
})

