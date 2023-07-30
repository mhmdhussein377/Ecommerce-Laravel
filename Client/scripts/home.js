const cart = document.querySelector(".cart-icon")
const cartSidebar = document.querySelector(".cart-sidebar");
const closeSidebarButton = document.querySelector(".cart-sidebar .close-button");
const logout = document.querySelector(".logout")
const categoriesElement = document.querySelector(".categories");

const token = localStorage.getItem("token")

if (!token) {
    window.location.href = "./../index.html"
}

cart
    .addEventListener("click", function () {
        cartSidebar
            .classList
            .remove('hide')
    });

closeSidebarButton.addEventListener("click", function () {
    cartSidebar
        .classList
        .add('hide')
})

logout.addEventListener("click", async() => {
    try {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        window.location.href = "./../index.html"
    } catch (error) {
        console.log(error)
    }
})

// displaying items function addToFavorite () {     console.log("added to
// favorite") }

try {
    const token = localStorage.getItem("token")
    async function getProduts() {
        const response = await axios.get("http://127.0.0.1:8000/api/products", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const categories = await axios.get("http://127.0.0.1:8000/api/categories", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        let products = []
        categories
            .data
            .map(async function (category) {
                let response = await axios.get(`http://127.0.0.1:8000/api/category/${category.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data
                console.log(data)
                console.log("data")
                if (data.products.length > 0) {
                    categoriesElement.innerHTML += `<div class="category">
                    <h3>${data.category_name}</h3>
                    <div class="cards">
                        ${data.products
                        ?.map((product) => `<div class="card">
                            <div class="card-img"><img src="./../assets/product_01.jpg" alt=""></div>
                            <div class="card-name">${product.name}</div>
                            <div class="card-desc">${product.description}</div>
                            <div class="buttons">
                                <div><button>Add to Favorites</button></div>
                                <div><button>Add to Cart</button></div>
                            </div>
                        </div>`)}
                    </div>
                </div>`;
                }

            })
        console.log("botttottom")
        console.log(products)
        // let organizedData = {} response.data.forEach(product => {     const
        // categoryId = product.category_id;     if(!organizedData[categoryId]) {
        // organizedData[categoryId] = []     } organizedData[categoryId].push(product)
        // }) console.log(organizedData)
    }
    getProduts()
} catch (error) {
    console.log(error)
}