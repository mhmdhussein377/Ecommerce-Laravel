const toggleButton = document.querySelector(".toggle-button");
const rightButtonsSM = document.querySelector(".right-buttons-sm");
const closeButton = document.querySelector(".right-buttons-sm .close");
const confirmDeleteModal = document.querySelector(".modal")
const closeModalButton = document.querySelector(".modal .close-modal")
const fileInput = document.getElementById("fileInput")
const confirmDeleteProduct = document.getElementById("confirm-delete")

const image = document.querySelector("img")
const nameInput = document.getElementById("name-input")
const descInput = document.getElementById("desc-input")
const categoriesSelect = document.getElementById("categories-select")
const uploadImageButton = document.getElementById("upload-image-button")
const uploadButton = document.getElementById("update-button")
const deleteButton = document.querySelector(".delete-button");


// direct the user to the login if he is not an admin
const user_role_id = JSON
    .parse(localStorage.getItem("user"))
    .user_role_id;

if (user_role_id !== 2) {
    window.location.href = "./../index.html";
}




const urlParams = new URLSearchParams(window.location.search);
const id = +urlParams.get("id");

toggleButton.addEventListener("click", () => {
    rightButtonsSM
        .classList
        .remove('hide');
})

closeButton.addEventListener("click", () => {
    rightButtonsSM
        .classList
        .add("hide");
})

deleteButton.addEventListener("click", () => {
    confirmDeleteModal
        .classList
        .remove("hide")
})

closeModalButton.addEventListener("click", () => {
    confirmDeleteModal
        .classList
        .add('hide')
})

uploadImageButton.addEventListener("click", () => {
    fileInput.click()
})

confirmDeleteProduct.addEventListener("click", async() => {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.delete(`http://127.0.0.1:8000/api/delete_product/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        window.location.href = "./../pages/admin-dashboard.html"
        console.log(response.data)
    } catch (error) {
        console.log(error)
    }
})

let base64 = "";

// handle image updating
fileInput.addEventListener("input", (e) => {
    if (e.target.files.length > 0) {
        function getBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        }
        getBase64(e.target.files[0]).then((data) => {
            image.src = data;
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            base64 = reader.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

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
        categories.map(category => (categoriesSelect.innerHTML += `<option value="${category.id}">${category.category_name}</option>`))
    } catch (error) {
        console.log(error)
    }
}

// display data
async function displayData() {
    try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const product = await response.data
        nameInput.value = product.name
        descInput.value = product.description
        image.src = product.image
        categoriesSelect.value = product.category_id

        console.log(product.category_id)

    } catch (error) {
        console.log(error)
    }
}

// updating functionality
uploadButton.addEventListener("click", () => {
    async function updateProduct() {

        const token = localStorage.getItem("token");

        const name = nameInput.value
        const description = descInput.value
        const imageBase64 = base64 || image.src
        const category_id = categoriesSelect.value

        const data = new URLSearchParams();
        data.append("name", name);
        data.append("description", description);
        data.append("image", imageBase64);
        data.append("category_id", + category_id);

        const response = await axios.put(`http://127.0.0.1:8000/api/update_product/${id}`, data.toString(), {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        // image.src = "" image.style.display = "none" nameInput.value = ""
        // descInput.value = ""

        window.location.href = "/Client/pages/admin-dashboard.html"
    }
    updateProduct()
})

displayCategories()
displayData()