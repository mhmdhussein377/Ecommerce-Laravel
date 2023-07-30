const form = document.querySelector("form")
const productImg = document.getElementById("product-img")
const productNameInput = document.getElementById("product-name-input")
const productDescInput = document.getElementById("product-desc-input")
const categories = document.getElementById("categories")
const uploadImageButton = document.getElementById("upload-img")
const createButton = document.querySelector(".create-button button")
const fileInput = document.getElementById("file-input")

uploadImageButton.addEventListener("click", () => {
    fileInput.click()
})

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
    let category = categories.value

    try {
        let data = {
            name: productName,
            description: productDesc,
            image: base64,
            category_id: 5
        }

        const headers = {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };

        let response = await axios.post("http://127.0.0.1:8000/api/create_product", data, {
            headers: headers
        });
        console.log("response")
        console.log(response)
    } catch (error) {
        console.log(error)
    }
})