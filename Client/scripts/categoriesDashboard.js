const deleteButton = document.querySelector(".delete-button");
const confirmDeleteModal = document.querySelector(".modal");
const closeModalButton = document.querySelector(".modal .close-modal");
const categoryNameCreate = document.getElementById("create-category-input")
const creaeteCategoryButton = document.getElementById('create-category-button')
const createCategoryBox = document.querySelector(".create-category-box")
const deleteSelect = document.getElementById("delete-select")
const updateSelect = document.getElementById("update-select")
const updateCategoryNameInput = document.getElementById('update-category-name')
const deleteCategoryForm = document.querySelector(".delete-category-box");
const acceptDeleteButton = document.getElementById("accept-delete-button");
const updateCategoryForm = document.querySelector(".update-category-box");
const categoryCreated = document.querySelector(".category-created")
const categoryDeleted = document.querySelector(".category-deleted");
const categoryUpdated = document.querySelector(".category-updated")

// direct the user to the login if he is not an admin
const user_role_id = JSON
    .parse(localStorage.getItem("user"))
    .user_role_id;

if (user_role_id !== 2) {
    window.location.href = "./../index.html";
}


// direct the user to the login page if the token is expired
const token = localStorage.getItem("token");

const parseJwt = (token) => {
    const decode = JSON.parse(atob(token.split(".")[1]));
    console.log(decode);
    if (decode.exp * 1000 < new Date().getTime()) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "./../index.html";
        console.log("Time Expired");
    }
};

parseJwt(token);


// display categories in the select
async function displayCategories() {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`http://127.0.0.1:8000/api/categories`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const categories = response.data
        console.log(categories)
        updateSelect.innerHTML = ""
        deleteSelect.innerHTML = ""
        categories.map(category => (updateSelect.innerHTML += `<option value="${category.id}">${category.category_name}</option>`))
        categories.map((category) => (deleteSelect.innerHTML += `<option value="${category.id}">${category.category_name}</option>`));
    } catch (error) {
        console.log(error)
    }
}

displayCategories()

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

        displayCategories()
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

    const categoryID = deleteSelect.value;
    const token = localStorage.getItem("token")

    try {
        const response = await axios.delete(`http://127.0.0.1:8000/api/delete_category/${categoryID}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        displayCategories()
        confirmDeleteModal
            .classList
            .add("hide")
        categoryDeleted
            .classList
            .remove("hide")
        setTimeout(() => {
            categoryDeleted
                .classList
                .add("hide")
        }, 2000)
    } catch (error) {
        console.log(error)
    }
})

// update category
updateCategoryForm.addEventListener('submit', async(e) => {
    e.preventDefault()

    let categoryName = updateCategoryNameInput.value
    let categoyrID = updateSelect.value
    let token = localStorage.getItem("token")

    try {
        let response = await axios.put(`http://127.0.0.1:8000/api/update_category/${categoyrID}`, {
            category_name: categoryName
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        displayCategories()
        updateCategoryNameInput.value = ""
        categoryUpdated
            .classList
            .remove("hide")
        setTimeout(() => {
            categoryUpdated
                .classList
                .add("hide");
        }, 2000);
    } catch (error) {
        console.log(error)
    }
})
