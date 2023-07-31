const form = document.querySelector("form")
const productImg = document.getElementById("product-img")
const productNameInput = document.getElementById("product-name-input")
const productDescInput = document.getElementById("product-desc-input")
const categoriesSelect = document.getElementById("categories")
const uploadImageButton = document.getElementById("upload-img")
const createButton = document.querySelector(".create-button button")
const fileInput = document.getElementById("file-input")
const imageError = document.querySelector(".img-error")


// direct the user to the login if he is not an admin
const user_role_id = JSON
    .parse(localStorage.getItem("user"))
    .user_role_id;

if (user_role_id !== 2) {
    window.location.href = "./../index.html";
}



uploadImageButton.addEventListener("click", () => {
    fileInput.click()
})

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
        categories.map(category => (categoriesSelect.innerHTML += `<option value="${category.id}">${category.category_name}</option>`))
    } catch (error) {
        console.log(error)
    }
}

displayCategories()

let base64 = "";

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
            productImg.style.display = "block";
            productImg.src = data;
        });

        const reader = new FileReader();
        reader.onloadend = () => {
            base64 = reader.result;
        };
        reader.readAsDataURL(e.target.files[0]);
    }
});

form.addEventListener('submit', async(e) => {
    e.preventDefault()

    let token = localStorage.getItem("token")
    let productName = productNameInput.value
    let productDesc = productDescInput.value
    let category_id = categoriesSelect.value

    try {
        let data = {
            name: productName,
            description: productDesc,
            image: base64,
            category_id
        }

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        console.log()

        if (fileInput.files.length === 0) {
            imageError
                .classList
                .remove("hide");
            setTimeout(() => {
                imageError
                    .classList
                    .add("hide");
            }, 3000);
            return;
        }

        let response = await axios.post("http://127.0.0.1:8000/api/create_product", data, {headers: headers});
        window.location.href = "./../pages/admin-dashboard.html"
    } catch (error) {
        console.log(error)
    }
})