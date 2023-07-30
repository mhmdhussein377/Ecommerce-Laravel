const deleteButton = document.querySelector(".delete-button");
const confirmDeleteModal = document.querySelector(".modal");
const closeModalButton = document.querySelector(".modal .close-modal");
const categoryNameCreate = document.getElementById("create-category-input")
const creaeteCategoryButton = document.getElementById('create-category-button')
const createCategoryBox = document.querySelector(".create-category-box")
const deleteSelect = document.getElementById("delete-select")
const deleteCategoryForm = document.querySelector(".delete-category-box");
const acceptDeleteButton = document.getElementById("accept-delete-button");
const categoryCreated = document.querySelector(".category-created")
const categoryDeleted = document.querySelector(".category-deleted");


deleteButton.addEventListener("click", () => {
    confirmDeleteModal
        .classList
        .remove("hide");
});

closeModalButton.addEventListener("click", () => {
    confirmDeleteModal
        .classList
        .add("hide");
});

// craete new category
createCategoryBox.addEventListener('submit', async(e) => {
    e.preventDefault()

    let categoryName = categoryNameCreate.value
    let token = localStorage.getItem("token")

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/create_category", {
            category_name: categoryName
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        categoryNameCreate.value = ""
        categoryCreated
            .classList
            .remove("hide")
        setTimeout(() => {
            categoryCreated
                .classList
                .add("hide")
        }, 2000)

    } catch (error) {
        console.log(error)
    }
})

// delete a category
deleteCategoryForm.addEventListener("submit", (e) => {
    e.preventDefault()
})

acceptDeleteButton.addEventListener("click", async() => {

    const category = deleteSelect.value;
    const token = localStorage.getItem("token")

    try {
        const response = await axios.delete("http://127.0.0.1:8000/api/delete_category/1", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        confirmDeleteModal.classList.add("hide")
        categoryDeleted.classList.remove("hide")
        setTimeout(() => {
            categoryDeleted.classList.add("hide")
        }, 2000)
    } catch (error) {
        console.log(error)
    }

    console.log(category)
})