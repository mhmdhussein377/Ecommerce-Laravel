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

// add to favorites / remove from favorites
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
        if (response.data == "Item has been added to favorites successfully") {
            event.target.innerText = "Remove from Favorites"
        } else {
            event.target.innerText = "Add to Favorites";
        }
        console.log(response);
    } catch (error) {
        console.log(error)
    }
}

// add to cart / remove from cart functionality
async function addToCart(event, product_id) {
    const user_id = JSON
        .parse(localStorage.getItem("user"))
        .id;
    const token = localStorage.getItem("token");
    const data = {
        user_id,
        product_id
    };

    try {
        let response = await axios.post("http://127.0.0.1:8000/api/cart/add", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.data.message == "Item added to cart successfully") {
            event.target.innerText = "Remove from Cart";
        } else {
            event.target.innerText = "Add to Cart";
        }
    } catch (error) {
        console.log(error);
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
                console.log(data.products)
                if (data.products.length > 0) {
                    // check if the product is favorited by the user
                    function checkFavoritesForProducts(products) {
                        return products.map(async(product) => {
                            try {
                                const data = {
                                    user_id: JSON
                                        .parse(localStorage.getItem("user"))
                                        .id,
                                    product_id: product.id
                                };
                                const isFavoritedResponse = await axios.post("http://127.0.0.1:8000/api/is_favorited", data);
                                const isInCartResponse = await axios.post("http://127.0.0.1:8000/api/is_item_in_cart", data);
                                console.log("-----------")
                                console.log(product.id)
                                console.log(isFavoritedResponse, isInCartResponse)
                                console.log(product.id)
                                console.log("-----------")
                                let isFavoritedAndInCart = [
                                    isFavoritedResponse.data === "Yes"
                                        ? true
                                        : false,
                                    isInCartResponse.data === "Yes"
                                        ? true
                                        : false
                                ];
                                return isFavoritedAndInCart
                            } catch (error) {
                                console.log(error);
                            }
                        });
                    }
                    const favoritesAndInCart = checkFavoritesForProducts(data.products)
                    Promise
                        .all(favoritesAndInCart)
                        .then((favoritesArray) => {
                            categoriesElement.innerHTML += `<div class="category">
                    <h3>${data.category_name}</h3>
                    <div class="cards">
                        ${data.products
                                ?.map(function (product, index) {
                                    console.log(favoritesArray[index])
                                    return `<div class="card"> <div class="card-img">
                                            <img src="./../assets/product_01.jpg" alt=""></div>
                                            <div class="card-name">${
                                    product.name}</div>
                                            <div class="card-desc">${
                                    product.description}</div>
                                            <div class="buttons">
                                                <div>
                                                    <button
                                                        class="add-favorite-button"
                                                        onClick="addToFavorites(event, ${
                                    product.id})">${favoritesArray[index][0]
                                        ? "Remove from Favorites"
                                        : "Add to Favorites"}</button>
                                                </div>
                                                <div>
                                                    <button onClick="addToCart(event, ${
                                    product.id})">${favoritesArray[index][1]
                                        ? "Remove from Cart"
                                        : "Add to Cart"}</button>
                                                </div>
                                            </div>
                                        </div>`;})}
                    </div>
                </div>`;
                                });
                        }})
            }
            getProduts()
        } catch (error) {
            console.log(error)
        }

        //     let isFavorited = false; async function checkFavorite() {     try { const
        // data = {             user_id: JSON .parse(localStorage.getItem("user")) .id,
        // product_id: product.id         };         const response = await
        // axios.post("http://127.0.0.1:8000/api/is_favorited", data);
        // console.log(response.data);     } catch (error) {         console.log(error);
        //     } }