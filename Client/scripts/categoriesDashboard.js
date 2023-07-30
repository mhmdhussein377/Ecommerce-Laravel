const deleteButton = document.querySelector(".delete-button");
const confirmDeleteModal = document.querySelector(".modal");
const closeModalButton = document.querySelector(".modal .close-modal");
const categoryNameCreate = document.getElementById("create-category-input")
const creaeteCategoryButton = document.getElementById('create-category-button')
const createCategoryBox = document.querySelector(".create-category-box")
const categoryCreated = document.querySelector(".category-created")

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

createCategoryBox.addEventListener('submit', async(e) => {
    e.preventDefault()

    let categoryName = categoryNameCreate.value
    let token = localStorage.getItem("token")

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/create_category", {category_name: categoryName}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        categoryNameCreate.value = ""
        categoryCreated.classList.remove("hide")
        setTimeout(() => {
            categoryCreated.classList.add("hide")
        }, 2000)

    } catch (error) {
        console.log(error)
    }
})