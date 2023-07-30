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

// displaying items
async function addToFavorites(event, product_id) {
    const user_id = JSON
        .parse(localStorage.getItem("user"))
        .id
    const token = localStorage.getItem('token')
    const data = {
        user_id,
        product_id
    }

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/favorites/add", data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.data === "Item has been added to favorites successfully") {
            event.target.innerText = "Remove from Favorites"
        }else {
            event.target.innerText = "Add to Favorites";
        }
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

try {
    const token = localStorage.getItem("token")
    async function getProduts() {
        const categories = await axios.get("http://127.0.0.1:8000/api/categories", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        categories
            .data
            .map(async function (category) {
                let response = await axios.get(`http://127.0.0.1:8000/api/category/${category.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = response.data
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
                                <div><button class="add-favorite-button" onClick="addToFavorites(event, ${product.id})">Add to Favorites</button></div>
                                <div><button>Add to Cart</button></div>
                            </div>
                        </div>`)}
                    </div>
                </div>`;
                }

            })
        // let organizedData = {} response.data.forEach(product => {     const
        // categoryId = product.category_id;     if(!organizedData[categoryId]) {
        // organizedData[categoryId] = []     } organizedData[categoryId].push(product)
        // }) console.log(organizedData)
    }
    getProduts()
} catch (error) {
    console.log(error)
}