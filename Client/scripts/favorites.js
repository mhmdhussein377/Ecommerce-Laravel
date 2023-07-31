const favoritesElement = document.querySelector(".favorites")
const cart = document.querySelector(".cart-icon");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeSidebarButton = document.querySelector(".cart-sidebar .close-button");
const cartProducts = document.querySelector(".cart-sidebar .products");
const logout = document.querySelector(".logout")

logout.addEventListener("click", async() => {
    try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "./../index.html";
    } catch (error) {
        console.log(error);
    }
});

cart.addEventListener("click", function () {
    cartSidebar
        .classList
        .remove("hide");
});

closeSidebarButton.addEventListener("click", function () {
    cartSidebar
        .classList
        .add("hide");
});

displayCartItems();

function executeTwoFunction(event, productId) {
    addToCart(event, productId);
    favoritesElement.innerHTML = ""
    displayFavoriteItems()
}

// increment the quantity
async function incrementQuantity(product_id) {
    try {
        const token = localStorage.getItem("token")
        const user_id = JSON
            .parse(localStorage.getItem("user"))
            .id

        const data = {
            user_id,
            product_id
        }

        const response = await axios.post("http://127.0.0.1:8000/api/cart/increment", data, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        cartProducts.innerHTML = ""
        displayCartItems()
    } catch (error) {}
}

// display items in the cart sidebar
async function displayCartItems() {
    const user_id = JSON
        .parse(localStorage.getItem("user"))
        .id;
    const token = localStorage.getItem("token");
    try {
        let response = await axios.post("http://127.0.0.1:8000/api/cart", {
            user_id
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        response
            .data
            .map(async function (cartItem) {
                async function getProduct(id) {
                    const response = await axios.get(`http://127.0.0.1:8000/api/products/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const product = response.data;
                    cartProducts.innerHTML += `<div class="product">
                <div class="product-left">
                    <div class="product-img">
                        <img src="${product.image}" alt="product">
                    </div>
                    <div class="product-details">
                        <div class="product-name">${product.name}</div>
                        <div class="">
                            <div class="product-quantity">${cartItem.quantity}x</div>
                            <div class="product-counter">
                                <span>-</span>
                                <span>${cartItem.quantity}</span>
                                <span onClick="incrementQuantity(${product.id})">+</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="delete-product" onClick="executeTwoFunction(event, ${product.id})"><i class="fa-solid fa-x"></i></div>
            </div>`;
                }
                getProduct(cartItem.product_id);
            });
    } catch (error) {
        console.log(error);
    }
}

// add to cart / remove from cart
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
        if (!event.target.classList.contains("fa-solid")) {
            if (response.data.message == "Item added to cart successfully") {
                event.target.innerText = "Remove from Cart";
            } else {
                event.target.innerText = "Add to Cart";
            }
        }
        cartProducts.innerHTML = "";
        displayCartItems();
    } catch (error) {
        console.log(error);
    }
}

function displayFavoriteItems() {
    try {
        const token = localStorage.getItem("token");
        const user_id = JSON
            .parse(localStorage.getItem("user"))
            .id;
        async function getFavorites() {
            const response = await axios.post("http://127.0.0.1:8000/api/favorites", {
                user_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            async function getProduct(productID) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/products/${productID}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    return await response.data;
                } catch (error) {
                    console.log(error);
                }
            }

            function checkInCartForProducts(products) {
                return products.map(async(product) => {
                    try {
                        const data = {
                            user_id: JSON
                                .parse(localStorage.getItem("user"))
                                .id,
                            product_id: product.product_id
                        };
                        const response = await axios.post("http://127.0.0.1:8000/api/is_item_in_cart", data);
                        return response.data === "Yes";
                    } catch (error) {
                        console.log(error);
                    }
                });
            }
            const isInCart = checkInCartForProducts(response.data);

            Promise
                .all(isInCart)
                .then(async(isInCartArray) => {
                    console.log(isInCartArray);
                    response
                        .data
                        .forEach(async(product, index) => {
                            const productData = await getProduct(product.product_id);
                            favoritesElement.innerHTML += `<div class="card">
                            <div class="card-img"><img src="${productData.image}" alt=""></div>
                            <div class="card-name">${productData.name}</div>
                            <div class="card-desc">${
                            productData.description}</div>
                            <div class="buttons">
                                <div onClick="addToCart(event, ${
                            productData.id})"><button>${
                            isInCartArray[index]
                                ? "Remove from Cart"
                                : "Add to Cart"}</button></div>
                            </div>
                        </div>`;
                        });
                });
        }
        getFavorites();
    } catch (error) {
        console.log(error);
    }
}

displayFavoriteItems()